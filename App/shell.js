define(function(require) { 
    var router = require('durandal/plugins/router');
	var system = require('durandal/system');  
	var custom = require('durandal/customBindings');

    return {
        router: router,
        // Function that allows DOM manipulation
        viewAttached: function() {
        },
        // Function that is called when view is loaded
        activate: function() {
        	// Tell Durandal where the viewmodels are
            router.mapAuto('viewmodels');
            
            // Add url variables
            router.mapRoute('#/patient/:view', 'viewmodels/patient');
            router.mapRoute('#/patient/:view/:patientId', 'viewmodels/patient');
            // Set initial view
            return router.activate('managepatients');
            
        },
        // This causes the submenu to appear when the main icon is hovered
        subMenuIn: function(element, event) {
        	// Get the class name for the element to toggle
        	var len = event.currentTarget.classList.length - 1;
        	var el = event.currentTarget.classList[0];
	        var cl =  el.replace('Nav','');
	        el = '.' + el;
	        // Show submenu
	        $('.' + cl).slideDown(400, function() {
	        	$('.' + cl).stop(true); // Stop all other animations
	        });

        },
        // This causes the submenu to disappear when the main icon is no longer hovered
        subMenuOut: function(element, event) {
        	// Get the class name for the element to toggle
        	var len = event.currentTarget.classList.length - 1;
	        var cl =  '.' + event.currentTarget.classList[0].replace('Nav','');
	        
	        system.log('sploosh');
	        // If the submenu is hovered, break the toggle animation,
	        // Else hide the submenu
	        $(cl).mouseenter(
	        function(e) {
	        	$(cl).stop(true);
	        }).mouseleave(
	        function(e) {
	        	$('.hoverNav').slideUp(400, function() {
	        		//$(cl).stop(true);
	        	});
	        });
	        
	        $(cl).slideUp();    
        }
    };
});