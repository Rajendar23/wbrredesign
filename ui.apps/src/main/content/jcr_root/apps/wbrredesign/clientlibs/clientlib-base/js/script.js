(function($, $document) {
	console.log("script file");

	$('#topic-dropdown li a').click(
			function(e) {
				e.preventDefault();
				console.log("in change");
				var _anchor = $(this)[0];
				var indicatorId = _anchor.id == undefined ? "" : _anchor.id;
				var economyUrl = $(_anchor).attr("selector") == undefined ? ""
						: $(_anchor).attr("selector");
				
				$.ajax({
					type : 'GET',
					url : '/content/wbl/en/data/exploreeconomies.test.json',
					success : function(data, textStatus, jqXHR) {
						console.log(data);
					},
				});
			});
})($, $(document));