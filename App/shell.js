define(function(require) { 
    var router = require('durandal/plugins/router');
	var system = require('durandal/system');  
	var custom = require('durandal/customBindings');
	var User   = require('modules/structures');
	var PatientModule = require('modules/patient');
	var userStructures = new User();
    var patient = new PatientModule();
	var self;
	
    return {
        router: router,
        role: ko.observable(),
        // Function that allows DOM manipulation
        viewAttached: function() {
        	
        },
        // Function that is called when view is loaded
        activate: function() {
        	self = this;
        	// Tell Durandal where the viewmodels are
            router.mapAuto('viewmodels');
            
            // Add url variables
            router.mapRoute('#/patient/servicerecord/:view/:patientId/:date', 'viewmodels/patient', 'Patient');
            router.mapRoute('#/patient/:view/', 'viewmodels/patient', 'Patient');
            router.mapRoute('#/patient/:view/:patientId', 'viewmodels/patient', 'Patient');
            
            patient.getRole(global.userId, global.practiceId).success(function(data) {
            	self.role(new userStructures.Role(data[0]));
            });
            
            // Set initial view
            return router.activate('managepatients');
            
        },
        // This causes the submenu to appear when the main icon is hovered
        subMenuIn: function(element, event) {
        	// Get the class name for the element to toggle
        	var len = event.currentTarget.classList.length - 1;
	        var cl =  event.currentTarget.classList[0].replace('Nav','');
	        // Hide all other submenus
	        $('.hoverNav').slideUp();
	        // Show submenu
	        $('.' + cl).slideDown();
        },
        // This causes the submenu to disappear when the main icon is no longer hovered
        subMenuOut: function(element, event) {
        	// Get the class name for the element to toggle
        	var len = event.currentTarget.classList.length - 1;
	        var cl =  '.' + event.currentTarget.classList[0].replace('Nav','');
	        
	        // If the submenu is hovered, break the toggle animation,
	        // Else hide the submenu
	        $(cl).hover(
	        function(e) {
	        	$(cl).stop(true);
	        },
	        function(e) {
	        	$(cl).slideUp(400, function() {
	        		$(cl).stop(true);
	        	});
	        });
	        
	        $(cl).slideUp();    
        },
        logout: function() {
        	location.assign('php/logout.php');
        },
        patientEnable: ko.computed(function() {
        	return true;
        })
    };
});