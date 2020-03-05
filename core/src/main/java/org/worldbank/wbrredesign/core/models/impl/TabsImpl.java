package org.worldbank.wbrredesign.core.models.impl;

import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.worldbank.wbrredesign.core.models.Tabs;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@Model(adaptables = SlingHttpServletRequest.class, adapters = Tabs.class, resourceType = "wbrredesign/components/content/tabs", defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class TabsImpl implements Tabs {

	private final Logger logger = LoggerFactory.getLogger(getClass());

	@SlingObject
	private ResourceResolver resourceResolver;

	@ValueMapValue
	@Default(values = "")
	private String tabsIn;

	@ValueMapValue
	@Default(values = "")
	private String tabsPath;

	@ChildResource
	private Resource list;

	private Map<String, String> tabs = null;

	@PostConstruct
	protected void init() {
		try {
			String key, value;

			if (StringUtils.isNotBlank(tabsIn) && tabsIn.equalsIgnoreCase("autopull")
					&& StringUtils.isNotBlank(tabsPath)) {
				Resource resource = resourceResolver.getResource(tabsPath);
				ValueMap valueMap = resource.adaptTo(ValueMap.class);
				String apiConfigured = valueMap.get("apiConfigured", "");

				tabs = new LinkedHashMap<>();
				if (apiConfigured.equalsIgnoreCase("yes") && StringUtils.isNoneBlank(apiConfigured)) {
					String list = valueMap.get("list", "");
					key = valueMap.get("key", "");
					value = valueMap.get("value", "");

					if (StringUtils.isNoneBlank(list) && StringUtils.isNoneBlank(key)
							&& StringUtils.isNoneBlank(value)) {
						JsonParser jsonParser = new JsonParser();
						JsonElement jsonElement = jsonParser.parse(list);

						if (jsonElement.isJsonArray()) {
							JsonArray jsonArray = jsonElement.getAsJsonArray();

							for (JsonElement jsonElement2 : jsonArray) {
								JsonObject jsonObject = jsonElement2.getAsJsonObject();
								tabs.put(jsonObject.get(key).getAsString(), jsonObject.get(value).getAsString());
							}
						}
					}
				} else {
					if (resource.hasChildren()) {
						Iterator<Resource> iterator = resource.listChildren();

						while (iterator.hasNext()) {
							Resource listResource = iterator.next();
							if (listResource.getName().equals("list")) {
								Resource listItemResource = null;
								ValueMap item = null;
								if (listResource.hasChildren()) {
									Iterator<Resource> listResourceIterator = listResource.listChildren();

									while (listResourceIterator.hasNext()) {
										listItemResource = listResourceIterator.next();

										item = listItemResource.adaptTo(ValueMap.class);
										key = item.get("pageTitle", "");
										value = item.get("pageName", "");
										if (StringUtils.isNoneBlank(key) && StringUtils.isNoneBlank(value)) {
											tabs.put(key, value);
										}
									}
								}
							}
						}
					}
				}
			} else if (StringUtils.isNoneBlank(tabsIn) && tabsIn.equalsIgnoreCase("manual")) {
				logger.info(tabsIn);
			}
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
	}

	@Override
	public String getTabsIn() {
		return tabsIn;
	}

	@Override
	public String getTabsPath() {
		return tabsPath;
	}

	@Override
	public Map<String, String> getTabs() {
		return tabs;
	}

}
