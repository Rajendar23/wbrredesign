package org.worldbank.wbrredesign.core.models;

import java.util.List;
import java.util.Map;

public interface Dropdown {

	public String getDropdownType();

	public String getLabel();

	public String getPlaceholder();

	public boolean getIsNavigation();

	public String getId();

	public boolean getIsCreatePages();

	public String getContentPath();

	public String getApi();

	public String getKey();

	public String getValue();

	public String[] getManualItems();

	public List<Map<String, String>> getDropdownItems();
	
	public String getPageSelector();

}
