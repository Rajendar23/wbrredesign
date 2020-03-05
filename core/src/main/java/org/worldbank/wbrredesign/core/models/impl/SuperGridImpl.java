package org.worldbank.wbrredesign.core.models.impl;

import javax.annotation.PostConstruct;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.worldbank.wbrredesign.core.models.SuperGrid;

@Model(adaptables = SlingHttpServletRequest.class, adapters = SuperGrid.class, resourceType = "wbrredesign/components/content/supergrid", defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Exporter(name = "jackson", extensions = "json")
public class SuperGridImpl implements SuperGrid {

	@ValueMapValue
	private String color, imagepath;

	@ValueMapValue
	@Default(values = "yes")
	private String container;

	@ValueMapValue
	@Default(values = "row full-row-white-components")
	private String containerClass;

	@ValueMapValue
	@Default(intValues = 64)
	private int paddingTop;

	@ValueMapValue
	@Default(intValues = 64)
	private int paddingBottom;

	@Override
	public String getColor() {
		return color;
	}

	@Override
	public String getImagepath() {
		return imagepath;
	}

	@Override
	public String getContainer() {
		return container;
	}

	@Override
	public int getPaddingTop() {
		return paddingTop;
	}

	@Override
	public int getPaddingBottom() {
		return paddingBottom;
	}

	@Override
	public String getContainerClass() {
		return containerClass;
	}

	@PostConstruct
	protected void init() {
		container = container.equalsIgnoreCase("yes") ? "container" : "";
	}
}
