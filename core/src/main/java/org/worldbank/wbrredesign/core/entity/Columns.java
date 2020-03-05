package org.worldbank.wbrredesign.core.entity;

import java.util.Map;

/**
 * Columns a generic bean class for twoColumn Component, Contains information
 * like colSpan value for both the column in desktop and tablet view.
 * 
 * @author Cognizant
 *
 */
public class Columns {
	private int count;
	private int val;
	private int deskVal;
	private int tabVal;
	private Map<String, String> clssAttr1;
	private Map<String, String> clssAttr2;

	/**
	 * Get the colSpan value in Desktop view
	 * 
	 * @return <int>deskVal
	 */
	public int getDeskVal() {
		return deskVal;
	}

	/**
	 * Constructor will set the colSpan value in Desktop view
	 * 
	 * @param deskVal
	 */
	public void setDeskVal(int deskVal) {
		this.deskVal = deskVal;
	}

	/**
	 * Get the colSpan value in tablet view
	 * 
	 * @return <int>tabVal
	 */
	public int getTabVal() {
		return tabVal;
	}

	/**
	 * Constructor will set the colSpan value in tablet view
	 * 
	 * @param tabVal
	 */
	public void setTabVal(int tabVal) {
		this.tabVal = tabVal;
	}

	/**
	 * Get the count of column
	 * 
	 * @return <int>count
	 */
	public int getCount() {
		return count;
	}

	/**
	 * Constructor will set the count of column.
	 * 
	 * @param count
	 */
	public void setCount(int count) {
		this.count = count;
	}

	/**
	 * Get the colSpan value
	 * 
	 * @return <int>val
	 */
	public int getVal() {
		return val;
	}

	/**
	 * Constructor will set colSpan value
	 * 
	 * @param val
	 */
	public void setVal(int val) {
		this.val = val;
	}

	/**
	 * Get the colSpan value of firstcolumn
	 * 
	 * @return <Map>clssAttr1
	 */
	public Map<String, String> getClssAttr1() {
		return clssAttr1;
	}

	/**
	 * Constructor will set the colSpan value of firstcolumn
	 * 
	 * @param clssAttr1
	 */
	public void setClssAttr1(Map<String, String> clssAttr1) {
		this.clssAttr1 = clssAttr1;
	}

	/**
	 * Get the colSpan value of secondcolumn
	 * 
	 * @return <Map>clssAttr2
	 */
	public Map<String, String> getClssAttr2() {
		return clssAttr2;
	}

	/**
	 * Constructor will set the colSpan value of secondcolumn
	 * 
	 * @param clssAttr2
	 */
	public void setClssAttr2(Map<String, String> clssAttr2) {
		this.clssAttr2 = clssAttr2;
	}

}