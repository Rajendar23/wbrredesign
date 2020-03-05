package org.worldbank.wbrredesign.core.util;

import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class AutoPullLinksUtil {
	private final Logger logger = LoggerFactory.getLogger(getClass());

	public Map<String, String> getAutoPullLinks(ResourceResolver resourceResolver, String tabsPath) {
		Map<String, String> links = new LinkedHashMap<>();
		try {
			String key, value;
			Resource resource = resourceResolver.getResource(tabsPath);
			ValueMap valueMap = resource.adaptTo(ValueMap.class);
			String apiConfigured = valueMap.get("apiConfigured", "");

			if (apiConfigured.equalsIgnoreCase("yes") && StringUtils.isNoneBlank(apiConfigured)) {
				String list = valueMap.get("list", "");
				key = valueMap.get("key", "");
				value = valueMap.get("value", "");

				if (StringUtils.isNoneBlank(list) && StringUtils.isNoneBlank(key) && StringUtils.isNoneBlank(value)) {
					JsonParser jsonParser = new JsonParser();
					JsonElement jsonElement = jsonParser.parse(list);

					if (jsonElement.isJsonArray()) {
						JsonArray jsonArray = jsonElement.getAsJsonArray();

						for (JsonElement jsonElement2 : jsonArray) {
							JsonObject jsonObject = jsonElement2.getAsJsonObject();
							links.put(jsonObject.get(key).getAsString(), jsonObject.get(value).getAsString());
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
										links.put(key, value);
									}
								}
							}
						}
					}
				}
			}
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return links;
	}
}
