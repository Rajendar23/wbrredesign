package org.worldbank.wbrredesign.core.models.impl;

import javax.annotation.PostConstruct;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.worldbank.wbrredesign.core.models.ListNavigation;

@Model(adaptables = SlingHttpServletRequest.class, adapters = ListNavigation.class, resourceType = "wbrredesign/components/content/list_navigation", defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ListNavigationImpl implements ListNavigation {

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@ValueMapValue
	private String header, headerFont;

	@ValueMapValue
	@Default(values = "Vertical")
	private String aspectRatio;

	@ValueMapValue
	@Default(intValues = 22)
	private int marginTop;

	@ValueMapValue
	@Default(intValues = 25)
	private int marginBottom;

	@ValueMapValue
	@Default(values = "Horizontal")
	private String linksAlign;

	@ChildResource(name = "listnavitems", via = "resource")
	private Resource listnavitems;

	@Override
	public String getAspectRatio() {
		return this.aspectRatio;
	}

	@Override
	public int getMarginTop() {
		return this.marginTop;
	}

	@Override
	public int getMarginBottom() {
		return this.marginBottom;
	}

	@Override
	public String getHeaderFont() {
		return this.headerFont;
	}

	@Override
	public String getLinksAlign() {
		return this.linksAlign;
	}

	@Override
	public String getHeader() {
		return this.header;
	}

	@Override
	public Resource getListnavitems() {
		return this.listnavitems;
	}

	@PostConstruct
	protected void init() {
		try {
			if (aspectRatio.equalsIgnoreCase("square"))
				aspectRatio = "_list_nav_img_square";
			else if (aspectRatio.equalsIgnoreCase("vertical"))
				aspectRatio = "_list_nav_img_vertical";
			else if (aspectRatio.equalsIgnoreCase("largeSquare"))
				aspectRatio = "_list_nav_img_largesquare";
			else
				aspectRatio = "_list_nav_img_horizontal";

		} catch (Exception e) {
			logger.error(e.getMessage());
		}
	}
}
