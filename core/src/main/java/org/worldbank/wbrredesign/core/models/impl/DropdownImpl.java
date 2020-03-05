package org.worldbank.wbrredesign.core.models.impl;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ModifiableValueMap;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.worldbank.wbrredesign.core.models.Dropdown;
import org.worldbank.wbrredesign.core.services.AzureConfiguration;
import org.worldbank.wbrredesign.core.util.HttpConnectionUtil;

import com.day.cq.wcm.api.Page;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@Model(adaptables = SlingHttpServletRequest.class, adapters = Dropdown.class, resourceType = "wbrredesign/components/content/dropdown", defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Exporter(name = "jackson", extensions = "json")
public class DropdownImpl implements Dropdown {
	private final Logger logger = LoggerFactory.getLogger(getClass());

	private static final String API_ITEMS = "apiItems";
	private static final String MANUAL_ITEMS = "manualItems";
	private static final String TITLE = "title";
	private static final String LINK = "link";
	private static final String SELECTOR = "selector";

	@SlingObject
	private ResourceResolver resourceResolver;

	@ScriptVariable
	private Page currentPage;

	@ScriptVariable
	Resource resource;

	@OSGiService
	List<AzureConfiguration> azureConfigurations;

	@ValueMapValue
	@Default(values = "")
	private String dropdownType;

	@ValueMapValue
	@Default(values = "")
	private String dropdownReference;

	@ValueMapValue
	@Default(values = "")
	private String label;

	@ValueMapValue
	@Default(values = "Select")
	private String placeholder;

	@ValueMapValue
	@Default(booleanValues = false)
	private boolean isNavigation;

	@ValueMapValue
	@Default(values = "")
	private String id;

	@ValueMapValue
	@Default(booleanValues = false)
	private boolean isCreatePages;

	@ValueMapValue
	@Default(values = "")
	private String contentPath;

	@ValueMapValue
	@Default(values = "")
	private String site;

	@ValueMapValue
	@Default(values = "")
	private String api;

	@ValueMapValue
	@Default(values = "")
	private String key;

	@ValueMapValue
	@Default(values = "")
	private String value;

	@ValueMapValue
	@Default(values = "")
	private String[] manualItems;

	List<Map<String, String>> dropdownItems;
	private String pageSelector;

	@PostConstruct
	protected void init() {
		try {
			String title, link, selector;
			Locale locale = currentPage.getLanguage();
			String currentPath = currentPage.getPath();
			logger.info(locale.getLanguage());
			logger.info(currentPath);
			logger.info(currentPath.substring(0, currentPath.indexOf("/" + locale.getLanguage()) + 1));
			if (dropdownType.equalsIgnoreCase("reference") && StringUtils.isNotBlank(dropdownReference)) {
				Resource referenceResource = resourceResolver.getResource(dropdownReference);
				ValueMap valueMap = referenceResource.adaptTo(ValueMap.class);

				if (valueMap.containsKey(API_ITEMS)) {
					String[] apiItems = valueMap.get(API_ITEMS, String[].class);
					dropdownItems = new LinkedList<>();
					for (int i = 0; i < apiItems.length; i++) {
						Map<String, String> item = parseItem(apiItems[i]);
						if (item != null) {
							dropdownItems.add(item);
						}
					}
				} else if (valueMap.containsKey(MANUAL_ITEMS)) {
					manualItems = valueMap.get(MANUAL_ITEMS, String[].class);
					dropdownItems = new LinkedList<>();
					for (int i = 0; i < manualItems.length; i++) {
						Map<String, String> item = parseItem(manualItems[i]);
						if (item != null) {
							dropdownItems.add(item);
						}
					}
				}
			} else if (dropdownType.equalsIgnoreCase("auto-pull")) {
				dropdownItems = new LinkedList<>();
				List<String> apiItems = new LinkedList<>();

				for (AzureConfiguration azureConfiguration : azureConfigurations) {
					if (azureConfiguration.getSiteName().equals(site)) {
						HttpConnectionUtil httpConnectionUtil = new HttpConnectionUtil();
						StringBuilder response = httpConnectionUtil.getResponse(api, azureConfiguration.getAzureKey(),
								azureConfiguration.getAzureValue());
						JsonElement jsonElement = new JsonParser().parse(response.toString());

						if (jsonElement.isJsonArray()) {
							JsonArray jsonArray = jsonElement.getAsJsonArray();
							for (JsonElement jsonElement2 : jsonArray) {
								JsonObject jsonObject = jsonElement2.getAsJsonObject();
								title = jsonObject.get(key).getAsString();
								link = contentPath;
								selector = jsonObject.get(value).getAsString();

								if (StringUtils.isNotBlank(title) && StringUtils.isNotBlank(link)
										&& StringUtils.isNotBlank(selector)) {
									JsonObject innerObject = new JsonObject();
									innerObject.addProperty(TITLE, title);
									innerObject.addProperty(LINK, link);
									innerObject.addProperty(SELECTOR, selector);
									apiItems.add(innerObject.toString());

									Map<String, String> item = parseItem(innerObject.toString());
									if (item != null) {
										dropdownItems.add(item);
									}
								}
							}

							ModifiableValueMap modifiableValueMap = resource.adaptTo(ModifiableValueMap.class);
							modifiableValueMap.put(API_ITEMS, apiItems.toArray());

							resource.getResourceResolver().commit();
						}
					}
				}
			} else if (dropdownType.equalsIgnoreCase("manual") && manualItems.length > 0) {
				dropdownItems = new LinkedList<>();
				for (int i = 0; i < manualItems.length; i++) {
					Map<String, String> item = parseItem(manualItems[i]);
					if (item != null) {
						dropdownItems.add(item);
					}
				}
			}
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
	}

	private Map<String, String> parseItem(String item) {
		Map<String, String> map = new HashMap<>();
		try {
			JsonElement jsonElement = new JsonParser().parse(item);
			if (jsonElement.isJsonObject()) {
				JsonObject jsonObject = jsonElement.getAsJsonObject();

				for (Entry<String, JsonElement> entry : jsonObject.entrySet()) {
					map.put(entry.getKey(), entry.getValue().getAsString());
				}
				return map;
			}
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return null;
	}

	@Override
	public String getDropdownType() {
		return dropdownType;
	}

	@Override
	public String getLabel() {
		return label;
	}

	@Override
	public String getPlaceholder() {
		return placeholder;
	}

	@Override
	public boolean getIsNavigation() {
		return isNavigation;
	}

	@Override
	public String getId() {
		return id;
	}

	@Override
	public boolean getIsCreatePages() {
		return isCreatePages;
	}

	@Override
	public String getContentPath() {
		return contentPath;
	}

	@Override
	public String getApi() {
		return api;
	}

	@Override
	public String getKey() {
		return key;
	}

	@Override
	public String getValue() {
		return value;
	}

	@Override
	public String[] getManualItems() {
		return manualItems;
	}

	@Override
	public List<Map<String, String>> getDropdownItems() {
		return dropdownItems;
	}

	@Override
	public String getPageSelector() {
		return pageSelector;
	}

}
