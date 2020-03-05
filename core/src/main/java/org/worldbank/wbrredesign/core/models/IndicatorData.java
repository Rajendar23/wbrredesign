package org.worldbank.wbrredesign.core.models;

import java.util.List;

public interface IndicatorData {

	public String getSite();

	public String getApi();

	public String getId();

	public String[] getTableLabels();

	public List<String> getIndicatorsData();

}
