/***************************************************************************************************
 * ViewModel:
 * Author(s):
 * Description: 
 **************************************************************************************************/
define(function(require) { 
	/*********************************************************************************************** 
	 * Includes*
	 **********************************************************************************************/
	var system = require('durandal/system');			// System logger
	var custom = require('durandal/customBindings');	// Custom bindings
	var viewModel = require('durandal/viewModel');
	var Backend = require('modules/patient');			// Backend
	// Subviews
	var personal = require('viewmodels/patient/personalinformation');
	var social = require('viewmodels/patient/socialandfamily');
	var service = require('viewmodels/patient/servicerecord');
	var followup = require('viewmodels/patient/followup');
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	var patient = ko.observable('');
	var patientId = ko.observable();
	var practiceId = ko.observable();
	var currentView = viewModel.activator();
	
	/*********************************************************************************************** 
	 * KO Computed Functions
	 **********************************************************************************************/
	 // Personal information url generator
	 var personalUrl = ko.computed(function(element) {
	 	return '#/patient/personalinformation/' + practiceId() + '/' + patientId();
	 });
	 // Social and Family History url generator
	 var socialUrl = ko.computed(function(element) {
	 	return '#/patient/socialandfamily/' + practiceId() + '/' + patientId();
	 });
	 // Service Record url generator
	 var serviceUrl = ko.computed(function(element) {
	 	return '#/patient/servicerecord/' + practiceId() + '/' + patientId();
	 });
	 // Follow Up url generator
	 var followupUrl = ko.computed(function(element) {
	 	return '#/patient/followup/' + practiceId() + '/' + patientId();
	 });

	/*********************************************************************************************** 
	 * ViewModel
	 *
	 * For including ko observables and computed functions, add an attribute of the same name.
	 * Ex: observable: observable
	 **********************************************************************************************/
	return {
		/******************************************************************************************* 
		 * Attributes
		 *******************************************************************************************/
		patient: patient,
		patientId: patientId,
		practiceId: practiceId,
		currentView: viewModel.activator(),
		personal: personal,
		social: social,
		service: service,
		followup: followup,
		/******************************************************************************************* 
		 * Methods
		 *******************************************************************************************/
		// This allow manipulation of the DOM
		viewAttached: function() {
			// Change the selected nav item 
			$('.navItem').removeClass('active');
			$('.patientNav').addClass('active');
			
			// Resize tree and content pane
			$('.patientTree').height(parseInt($('.viewHolder').height()) - 20);
			$('.contentPane').height(parseInt($('.viewHolder').height()) - 20);
			$(window).resize(function() {
				system.log('trigger');
				$('.patientTree').height(parseInt($('.viewHolder').height()) - 20);
				$('.contentPane').height(parseInt($('.viewHolder').height()) - 20);
			});
		},
		// Loads when view is loaded
		activate: function(data) {
			var self = this;
			
			// Get URL parameters (make sure to create an observable above for each)
			self.patientId(data.patientId);
			self.practiceId('1'); // Uncomment when adding login self.practiceId(data.practiceId);
            var view = data.view;
            
            // Switch view
            switch(view) {
            	case 'socialandfamily': 
            		self.currentView.activateItem(social, data);
            		break;
            	case 'servicerecord': 
            		self.currentView.activateItem(service, data);
            		break;
            	case 'followup': 
            		self.currentView.activateItem(followup, data);
            		break;
            	default: 
            		self.currentView.activateItem(personal, data);
            		break;				 	
            }
            
            // Load Patient information
            var backend = new Backend();
            return backend.getPatient(self.patientId()).success(function(data) {
            	if(data.length > 0) {
            		var p = new backend.Patient(data[0]);
            		self.patient(p);
            	}
            });
		},
		// URL generators
		personalUrl: personalUrl,
		socialUrl: socialUrl,
		serviceUrl: serviceUrl,
		followupUrl: followupUrl
	};
});