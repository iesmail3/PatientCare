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
	var serviceView = require('viewmodels/patient/servicerecord/serviceview');
	var history = require('viewmodels/patient/servicerecord/historypresentillness');
	var physical = require('viewmodels/patient/servicerecord/physicalexamination');
	var lab = require('viewmodels/patient/servicerecord/labxrayreport');
	var diagnosis = require('viewmodels/patient/servicerecord/diagnosisplaninstruction');
	var order = require('viewmodels/patient/servicerecord/order');
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	var backend = new Backend();
	var patient = ko.observable(new backend.Patient());
	var serviceRecords = ko.observableArray([]);
	var patientId = ko.observable();
	var date = ko.observable();
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
	 var serviceViewUrl = ko.computed(function(element) {
		return '#/patient/servicerecord/serviceview/' + practiceId() + '/' + patientId() + '/' + date();
	 });
	 // History Present Illness url generator
	 var historyUrl = ko.computed(function(element) {
		return '#/patient/servicerecord/historypresentillness/' + date() + '/' + patientId();
	 });
	 // Physical Examinations url generator
	 var physicalUrl = ko.computed(function(element) {
		return '#/patient/servicerecord/physicalexamination/' + date() + '/' + patientId();
	 });
	 // Labs & X-ray Reports url generator
	 var labUrl = ko.computed(function(element) {
		return '#/patient/servicerecord/labxrayreport/' + date() + '/' + patientId();
	 });
	 // Diagnosis Plan and Instructions url generator
	 var diagnosisUrl = ko.computed(function(element) {
		return '#/patient/servicerecord/diagnosisplaninstruction/' + date() + '/' + patientId();
	 });
	 // Orders url generator
	 var orderUrl = ko.computed(function(element) {
		return '#/patient/servicerecord/order/' + date() + '/' + patientId();
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
		patient: patient,
		serviceRecords: serviceRecords,
		patientId: patientId,
		date: date,
		practiceId: practiceId,
		currentView: viewModel.activator(),
		personal: personal,
		social: social,
		service: service,
		followup: followup,
		serviceView: serviceView,
		history: history,
		physical: physical,
		lab: lab,
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
			self.date(data.date);
			
			console.log("Patient ID: " + data.patientId);
			console.log("Date: " + data.date);
			
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
				case 'historypresentillness':
					self.currentView.activateItem(history, data);
					break;
				case 'physicalexamination':
					self.currentView.activateItem(physical, data);
					break;
				case 'labxrayreport':
					self.currentView.activateItem(lab, data);
					break;
				case 'diagnosisplaninstruction':
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
			backend.getServiceRecords(self.patientId()).success(function(data) {
				if(data.length > 0) {
					var serviceRecord = $.map(data, function(item) {return new backend.ServiceRecord(item)});
					self.serviceRecords(serviceRecord);
				}
			});

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
		followupUrl: followupUrl,
		serviceViewUrl: serviceViewUrl,
		historyUrl: historyUrl,
		physicalUrl: physicalUrl,
		labUrl: labUrl,
		diagnosisUrl: diagnosisUrl,
		orderUrl: orderUrl
	};
});