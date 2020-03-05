"use strict";
use(function() {
	var data = {};
	var api_tems = resource.properties["apiItems"];
	var selector = request.requestPathInfo.selectors[0];

	for (var i = 0; i < api_tems.length; i++) {
		var array_element = JSON.parse(api_tems[i]);

		if (array_element.selector == selector) {
			data.code = array_element.title;
		}
	}

	return data;
});