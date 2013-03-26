/***************************************************************************************************
 * ViewModel:
 * Author(s):
 * Description: 
 **************************************************************************************************/
define(function(require) { 
	/*********************************************************************************************** 
	 * Includes*
	 **********************************************************************************************/
	var system     = require('durandal/system');			// System logger
	var custom     = require('durandal/customBindings');	// Custom bindings
	var viewModel  = require('durandal/viewModel');      	// ViewModel
	var Backend    = require('modules/patient');			// Backend
	var Structures = require('modules/patientStructures'); 	// Patient Structures 
	
	// Subviews
	var personal = require('viewmodels/patient/personalinformation');
	var social   = require('viewmodels/patient/socialandfamily');
	var service  = require('viewmodels/patient/servicerecord');
	var followup = require('viewmodels/patient/followup');
	var serviceview = require('viewmodels/patient/servicerecord/serviceview');
	var history = require('viewmodels/patient/servicerecord/history');
	var physical = require('viewmodels/patient/servicerecord/physical');
	var report = require('viewmodels/patient/servicerecord/report');
	var diagnosis = require('viewmodels/patient/servicerecord/diagnosis');
	var order = require('viewmodels/patient/servicerecord/order');
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	var backend = new Backend();
	var structures = new Structures();
	var patient = ko.observable(new backend.Patient());
	var serviceRecords = ko.observableArray([]);
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
	 // Service Record View url generator
	 var serviceviewUrl = ko.computed(function(element) {
		return '#/patient/serviceview/' + practiceId() + '/' + patientId();
	 });
	 // History Present Illness url generator
	 var historyUrl = ko.computed(function(element) {
		return '#/patient/history/' + practiceId() + '/' + patientId();
	 });
	 // Physical Examinations url generator
	 var physicalUrl = ko.computed(function(element) {
		return '#/patient/physical/' + practiceId() + '/' + patientId();
	 });
	 // Labs & X-ray Reports url generator
	 var reportUrl = ko.computed(function(element) {
		return '#/patient/report/' + practiceId() + '/' + patientId();
	 });
	 // Diagnosis Plan and Instructions url generator
	 var diagnosisUrl = ko.computed(function(element) {
		return '#/patient/diagnosis/' + practiceId() + '/' + patientId();
	 });
	 // Orders url generator
	 var orderUrl = ko.computed(function(element) {
		return '#/patient/order/' + practiceId() + '/' + patientId();
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
		backend: backend,
		structures: structures,
		patient: patient,
		serviceRecords: serviceRecords,
		patientId: patientId,
		practiceId: practiceId,
		currentView: viewModel.activator(),
		personal: personal,
		social: social,
		service: service,
		followup: followup,
		serviceview: serviceview,
		history: history,
		physical: physical,
		report: report,
		diagnosis: diagnosis,
		order: order,
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
            
            if(self.patientId() == 'new')
            	self.patient(new self.structures.Patient());
            	
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
				case 'serviceview':
					self.currentView.activateItem(serviceview, data);
					break;
				case 'history': 
					self.currentView.activateItem(history, data);
					break;
				case 'physical': 
					self.currentView.activateItem(physical, data);
					break;
				case 'report': 
					self.currentView.activateItem(report, data);
					break;
				case 'diagnosis':
					self.currentView.activateItem(diagnosis, data);
					break;
				case 'order':
					self.currentView.activateItem(order, data);
					break;
            	default: 
            		self.currentView.activateItem(personal, data);
            		break;
            }
            
            // Load Patient information
            var backend = new Backend();
			backend.getServiceRecords(self.patientId(), self.practiceId()).success(function(data) {
				if(data.length > 0) {
					var serviceRecord = $.map(data, function(item) {return new backend.ServiceRecord(item)});
					self.serviceRecords(serviceRecord);
				}
			});

			return backend.getPatient(self.patientId(), self.practiceId()).success(function(data) {
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
		followupUrl: followupUrl,
		serviceviewUrl: serviceviewUrl,
		historyUrl: historyUrl,
		physicalUrl: physicalUrl,
		reportUrl: reportUrl,
		diagnosisUrl: diagnosisUrl,
		orderUrl: orderUrl
	};
});