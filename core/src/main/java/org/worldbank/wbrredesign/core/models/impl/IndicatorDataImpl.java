package org.worldbank.wbrredesign.core.models.impl;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.worldbank.wbrredesign.core.models.IndicatorData;
import org.worldbank.wbrredesign.core.services.AzureConfiguration;
import org.worldbank.wbrredesign.core.util.HttpConnectionUtil;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@Model(adaptables = SlingHttpServletRequest.class, adapters = IndicatorData.class, resourceType = "wbrredesign/components/content/indicator_data", defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class IndicatorDataImpl implements IndicatorData {

	Logger logger = LoggerFactory.getLogger(this.getClass());

	private List<String> indicatorsData;

	@SlingObject
	private SlingHttpServletRequest request;

	@OSGiService
	List<AzureConfiguration> azureConfigurations;

	@PostConstruct
	protected void init() {
		indicatorsData = new ArrayList<>();
		indicatorsData.add("tat");
		String[] selectors = request.getRequestPathInfo().getSelectors();
		logger.info(selectors[0]);
	}

	public void setParameter(String indicatorId, String economyUrl) {
		logger.info(indicatorId);
		logger.info(economyUrl);

		String economyApi = "https://wbgindicators.azure-api.net/apis/igdataapi/data/wbl/year/current/economies?lang=en";
		String indicatorDataValuesApi = "https://wbgindicators.azure-api.net/apis/igdataapi/data/wbl/economy/{economyCode}/indicator/{indicatorCode}/year/current/indicatordatapointvalues/multilevel?lang=en";

		for (AzureConfiguration azureConfiguration : azureConfigurations) {
			if (azureConfiguration.getSiteName().equals("wbl")) {
				logger.info("asfasf");
				HttpConnectionUtil httpConnectionUtil = new HttpConnectionUtil();
				StringBuilder response = httpConnectionUtil.getResponse(economyApi, azureConfiguration.getAzureKey(),
						azureConfiguration.getAzureValue());
				JsonElement jsonElement = new JsonParser().parse(response.toString());

				if (jsonElement.isJsonArray()) {
					JsonArray jsonArray = jsonElement.getAsJsonArray();
					for (JsonElement jsonElement3 : jsonArray) {
						JsonObject jsonObject = jsonElement3.getAsJsonObject();
						if (economyUrl.equals(jsonObject.get("EconomyUrlName").getAsString())) {
							indicatorDataValuesApi = indicatorDataValuesApi.replace("{economyCode}",
									jsonObject.get("EconomyCode").getAsString());
							indicatorDataValuesApi = indicatorDataValuesApi.replace("{indicatorCode}",
									indicatorId.toLowerCase());
							logger.info(indicatorDataValuesApi);

							HttpConnectionUtil httpConnectionUtil2 = new HttpConnectionUtil();
							StringBuilder response2 = httpConnectionUtil2.getResponse(indicatorDataValuesApi,
									azureConfiguration.getAzureKey(), azureConfiguration.getAzureValue());
							JsonElement jsonElement2 = new JsonParser().parse(response2.toString());

							if (jsonElement2.isJsonArray()) {
								indicatorsData = new ArrayList<>();
								JsonArray jsonArray2 = jsonElement2.getAsJsonArray();
								logger.info(jsonArray2.toString());
								for (JsonElement jsonElement4 : jsonArray2) {
									JsonObject jsonObject2 = jsonElement4.getAsJsonObject();

									if (jsonObject2.has("IndicatorDataPointList")
											&& jsonObject2.get("IndicatorDataPointList").isJsonArray()) {
										JsonArray dataPointsArray = jsonObject2.get("IndicatorDataPointList")
												.getAsJsonArray();
										for (JsonElement jsonElement5 : dataPointsArray) {
											JsonObject dataPoint = jsonElement5.getAsJsonObject();
											indicatorsData.add(dataPoint.get("IndicatorDataPointName").getAsString());
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}

	@Override
	public List<String> getIndicatorsData() {
		return indicatorsData;
	}

	@Override
	public String getSite() {
		return null;
	}

	@Override
	public String getApi() {
		return null;
	}

	@Override
	public String getId() {
		return null;
	}

	@Override
	public String[] getTableLabels() {
		return null;
	}
}