package org.worldbank.wbrredesign.core.models.impl;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.ExporterOption;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.worldbank.wbrredesign.core.models.RedesignTitle;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Model(adaptables = SlingHttpServletRequest.class, adapters = RedesignTitle.class, resourceType = "wbrredesign/components/content/redesign_title", defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Exporter(name = "jackson", extensions = "json", options = {
		@ExporterOption(name = "MapperFeature.SORT_PROPERTIES_ALPHABETICALLY", value = "true"),
		@ExporterOption(name = "SerializationFeature.WRITE_DATES_AS_TIMESTAMPS", value = "true") })
public class RedesignTitleImpl implements RedesignTitle {

	@ValueMapValue
	private String header;

	@ValueMapValue
	private String headerFont;

	@ValueMapValue
	private String textColor;

	@ValueMapValue
	private Integer marginTop;

	@ValueMapValue
	private Integer marginBottom;

	@Override
	public String getHeader() {
		return header;
	}

	@Override
	public String getHeaderFont() {
		return headerFont;
	}

	@Override
	public String getTextColor() {
		return textColor;
	}

	@Override
	public Integer getMarginTop() {
		return marginTop;
	}

	@Override
	public Integer getMarginBottom() {
		return marginBottom;
	}

	@Override
	@JsonIgnore
	public String getHelloWorld() {
		return "Hello world";
	}

}
