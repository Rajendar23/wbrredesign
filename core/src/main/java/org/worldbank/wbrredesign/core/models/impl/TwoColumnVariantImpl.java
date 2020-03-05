package org.worldbank.wbrredesign.core.models.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.worldbank.wbrredesign.core.entity.Columns;
import org.worldbank.wbrredesign.core.models.TwoColumnVariant;

@Model(adaptables = SlingHttpServletRequest.class, adapters = TwoColumnVariant.class, resourceType = "wbrredesign/components/content/twovariantscolumn")
public class TwoColumnVariantImpl implements TwoColumnVariant {

	private final Logger logger = LoggerFactory.getLogger(getClass());

	@ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
	private String desktopColumns, tabletColumns;

	@Override
	public List<Columns> getCol() {
		return col;
	}

	@Override
	public void setCol(List<Columns> col) {
		this.col = col;
	}

	private List<Columns> col;

	@PostConstruct
	protected void init() {
		col = new ArrayList<>();
		try {
			if (desktopColumns != null || tabletColumns != null) {
				String[] desktopColVals = desktopColumns.split(",");
				String[] tabletColVals = tabletColumns.split(",");
				int[] mdVal = setVals(desktopColVals);
				int[] smVal = setVals(tabletColVals);

				Columns item = new Columns();
				Map<String, String> clssAttr1 = new HashMap<>();
				Map<String, String> clssAttr2 = new HashMap<>();
				if (desktopColumns.equals(tabletColumns)) {
					clssAttr1.put("class", "contentdiv col-sm-" + smVal[0]);
					clssAttr2.put("class", "asidediv col-sm-" + smVal[1]);
				} else {
					clssAttr1.put("class", "contentdiv col-sm-" + smVal[0] + " col-md-" + mdVal[0]);
					clssAttr2.put("class", "asidediv col-sm-" + smVal[1] + " col-md-" + mdVal[1]);
				}
				item.setClssAttr1(clssAttr1);
				item.setClssAttr2(clssAttr2);

				col.add(item);
				setCol(col);
			}
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
	}

	private int[] setVals(String[] colVals) {
		int[] desktopCols = new int[2];
		int i = 0;
		for (String s : colVals) {
			desktopCols[i] = Integer.parseInt(s);
			i++;
		}
		return desktopCols;
	}

}
