(function($, $document) {
	"use strict";

	
	$(document).on("foundation-contentloaded", function(e) {
		// if there is already an inital value make sure the according target
		// element becomes visible
		$(".cq-dialog-checkbox-showhide").each(function() {
			checkboxShowHide($(this));
		});

	});

	$(document).on("change", ".cq-dialog-checkbox-showhide", function(e) {
		checkboxShowHide($(this));
	});

	function checkboxShowHide(el) {

		// get the selector to find the target elements. its stored as data-..
		// attribute
		var target = el.data("cqDialogCheckboxShowhideTarget");

		// is checkbox checked?
		var checked = el.prop('checked');

		// get the selected value
		// if checkbox is not checked, we set the value to empty string
		var value = checked ? el.val() : '';

		// make sure all unselected target elements are hidden.
		$(target).not(".hide").addClass("hide");

		// unhide the target element that contains the selected value as
		// data-showhidetargetvalue attribute
		$(target).filter("[data-showhidetargetvalue='" + value + "']")
				.removeClass("hide");

	}
})($, $(document));