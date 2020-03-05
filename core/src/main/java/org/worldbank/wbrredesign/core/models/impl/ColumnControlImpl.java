package org.worldbank.wbrredesign.core.models.impl;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.worldbank.wbrredesign.core.entity.Columns;
import org.worldbank.wbrredesign.core.models.ColumnControl;

@Model(adaptables = SlingHttpServletRequest.class, adapters = ColumnControl.class, resourceType = "wbrredesign/components/content/colctrlcomp")
public class ColumnControlImpl implements ColumnControl {

	private final Logger logger = LoggerFactory.getLogger(getClass());

	@ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
	private String desktopColumns, tabletColumns;

	private List<Columns> columns;

	@Override
	public List<Columns> getCol() {
		return this.columns;
	}

	@Override
	public void setCol(List<Columns> columns) {
		this.columns = columns;
	}

	@PostConstruct
	protected void init() {
		columns = new ArrayList<>();
		try {
			if (desktopColumns != null || tabletColumns != null) {
				int deskTopCols = Integer.parseInt(desktopColumns);
				int tabCols = Integer.parseInt(tabletColumns);

				int mdVal = 12 / deskTopCols;
				int smVal = 12 / tabCols;

				for (int i = 0; i < deskTopCols; i++) {
					Columns item = new Columns();
					item.setCount(i);
					item.setDeskVal(mdVal);
					item.setTabVal(smVal);

					columns.add(item);
				}
			}
			setCol(columns);
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
	}
}
