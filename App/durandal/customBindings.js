define(function(require) {
	var system = ('./system');
	
	// Datepicker
	ko.bindingHandlers.datepicker = {
		init: function(element, valueAccessor) {
			var value = valueAccessor(); 
			
			$(element).datepicker();
			for(var key in value) {
				$(element).datepicker("option", key, value[key]);
			}
		}	
	};
});