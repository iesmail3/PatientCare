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
	
	ko.bindingHandlers.timepicker = {
		init: function(element, valueAccessor) {
			var value = valueAccessor(); 
			
			console.log(value);
			$(element).timepicker();
			for(var key in value) {
				$(element).timepicker("option", key, value[key]);
			}
		}	
	};
});