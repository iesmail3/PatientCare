define(function(require) {
	var system = require('./system');
	
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
	
	// Timepicker
	ko.bindingHandlers.timepicker = {
		init: function(element, valueAccessor) {
			var value = valueAccessor(); 

			$(element).timepicker();
			for(var key in value) {
				$(element).timepicker("option", key, value[key]);
			}
		}	
	};
	
	// Typeahead
	ko.bindingHandlers.typeahead = {
  		init: function(element, valueAccessor) {
	    var binding = this;
	    var elem = $(element);
	    var value = valueAccessor();

	    // Setup Bootstrap Typeahead for this element.
	    elem.typeahead({
			source: function() { return ko.utils.unwrapObservable(value.source); },
	      	onselect: function(val) { value.value(val); }
	    });
	 
	    // Set the value of the target when the field is blurred.
	    elem.blur(function() { value.value(elem.val()); });
	    
		},
  		update: function(element, valueAccessor) {
    		var elem = $(element);
    		var value = valueAccessor();
    		elem.val(value.value());
  		}
	};
	
	ko.bindingHandlers.uploader = {
		init: function(element, valueAccessor, allBindingsAccessor, vm, bindingContext) {
			var value = valueAccessor();
			var m = $(element).fineUploader({
		    	request: {
		        	endpoint: 'php/handleUploads.php'
		      	},
		      	autoUpload: false,
		     	text: {
		      		uploadButton: 'Select File'
             	},
			});	
		}, 
		update: function(element, valueAccessor) { 
		}	
    };
});