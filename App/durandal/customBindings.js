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
			var options = {};
			for(var key in value) {
				options[key] = value[key];
			}
			$(element).timepicker(options);
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
	
	/**********************************************************************************************
	 * Shortcut
	 * 
	 * Use: Binds a keyboard shortcut to a click event
	 * How to use: data-bind="event: {click: functionCall}, shortcut: 'keyboard shortcut'"
	 * Example: <div data-bind="event: {click: closeForm}, shortcut: 'esc'"
	 *********************************************************************************************/
	var special_key_map = { 'enter': 13, 'esc': 27}
	ko.bindingHandlers.shortcut = {
	    init: function(element, valueAccessor, allBindingsAccessor,viewModel) {
	        var key = valueAccessor();
	        key = key.toLowerCase();
	        var match = key.match(/ctrl\+/gi);
	        var ctrl_modifier = Boolean(match && match.length > 0);
	        match = key.match(/alt\+/gi);
	        var alt_modifier = Boolean(match && match.length > 0);
	        key = key.replace(/(alt\+|ctrl\+)/gi,'');
	        var keycode = null;
	        if( key in special_key_map) {
	            keycode = special_key_map[key];
	        }else {
	            keycode = key.charCodeAt(0);
	        }
	 
	        // if no modifiers are specified in the shortcut (.e.g shortcut is just 'n')
	        // in such cases, do not trigger the shortcut if the focus is on
	        // form field.
	        // if modifier are specified, then even if focus is on form field
	        // trigger the shortcut (e.g. ctrl+enter)
	        var ignore_form_input=Boolean(ctrl_modifier || alt_modifier || key in special_key_map);
	 
	        var handler = function(event) {
	            //first check if the element is visible. Do not trigger clicks
	            // on invisible elements. This way I can add short cuts on
	            // drop down menus.
	            var $element = $(element);
	            var $target = $(event.target);
	            var is_forminput = Boolean($target.is('button')==false && $target.is(':input')==true)
	            if($element.is(':visible') && (ignore_form_input==true || is_forminput==false)) {
	                var modifier_match = ( ctrl_modifier == (event.metaKey || event.ctrlKey))
	                    && ( alt_modifier == event.altKey );
	 
	                if( modifier_match && (event.charCode == keycode || event.keyCode == keycode)) {
	                    event.preventDefault();
	                    event.stopPropagation();
	                    $element.click();
	                    // event is handled so return false so that any further propagation is stopped.
	                    return false;
	                }
	            }
	            // event is not handled. Hence return true so that propagation continues.
	            return true;
	        }
	 
	        var eventname='keypress';
	        if( key in special_key_map) {
	            eventname = 'keydown';
	        }
	 
	        $('body').on(eventname, handler);
	 
	        var removeHandlerCallback = function() {
	            $('body').off(eventname, handler);
	        }
	 
	        // Now add a callback on the element so that when the element is 'disposed'
	        // we can remove the event handler from the 'body'
	        ko.utils.domNodeDisposal.addDisposeCallback(element, removeHandlerCallback);
	    }
	}
	
	/**********************************************************************************************
	 * Sort
	 * 
	 * Use: To sort an obersable array by one of it's fields
	 * How to use: data-bind="sort: {column: 'field to search', array: observableArray}"
	 * Example: <div data-bind="sort: {column: 'firstName', array: patients}"
	 *********************************************************************************************/
	ko.bindingHandlers.sort = {
		init: function(element, valueAccessor, allBindingsAccessor,viewModel) {
			var e = $(element);
			var value = valueAccessor();
			var arrow = e.find('.arrow');
			if(arrow.length == 0)
				arrow = $('<div class="null"></div>');
			var a = value.array;
			var column = value.column;
			
			e.on('click', function(e) {
				if(arrow.attr('class').indexOf('down') >= 0) {
					a.sort(function(one, two) {
						return one[column]() == two[column]() ? 0 : (one[column]() < two[column]() ? -1 : 1);
					});
					arrow.removeClass('down').addClass('up');
				}
				else {
					a.sort(function(one, two) {
						return one[column]() == two[column]() ? 0 : (one[column]() < two[column]() ? 1 : -1);
					});
					arrow.removeClass('up').addClass('down');
				}
			});
		}
	}
});