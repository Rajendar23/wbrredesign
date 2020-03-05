package org.worldbank.wbrredesign.core.models;

import org.apache.sling.api.resource.Resource;

public interface ListNavigation {

	public String getAspectRatio();

	public int getMarginTop();

	public int getMarginBottom();

	public String getHeaderFont();

	public String getLinksAlign();

	public String getHeader();

	public Resource getListnavitems();

}
