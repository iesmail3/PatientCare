/***************************************************************************************************
 * ViewModel:
 * Author(s):
 * Description: 
 **************************************************************************************************/
define(function(require) { 
	/*********************************************************************************************** 
	 * Includes
	 **********************************************************************************************/
	var system     = require('durandal/system');			// System logger
	var custom     = require('durandal/customBindings');	// Custom bindings
	var viewModel  = require('durandal/viewModel');      	// ViewModel
	var Backend    = require('modules/patient');			// Backend
	var Structures = require('modules/patientStructures'); 	// Patient Structures 
	var Forms = require('modules/form');					// Common form elements
	
	// Subviews
	var personal 	= require('viewmodels/patient/personalinformation');
	var social   	= require('viewmodels/patient/socialandfamily');
	var service  	= require('viewmodels/patient/servicerecord');
	var followup 	= require('viewmodels/patient/followup');
	var serviceview = require('viewmodels/patient/servicerecord/serviceview');
	var history 	= require('viewmodels/patient/servicerecord/history');
	var physical 	= require('viewmodels/patient/servicerecord/physical');
	var report 		= require('viewmodels/patient/servicerecord/report');
	var diagnosis 	= require('viewmodels/patient/servicerecord/diagnosis');
	var order 		= require('viewmodels/patient/servicerecord/order');
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	var form = new Forms();
	var backend = new Backend();
	var structures = new Structures();
	var patient = ko.observable(new structures.Patient());
	var serviceRecords = ko.observableArray([]);
	var patientId = ko.observable();
	var practiceId = ko.observable();
	var date = ko.observable();
	var currentView = viewModel.activator();
	
	/*********************************************************************************************** 
	 * KO Computed Functions
	 **********************************************************************************************/
	 // Personal information url generator
	 var personalUrl = ko.computed(function(element) {
	 	return '#/patient/personalinformation/' + patientId();
	 });
	 // Social and Family History url generator
	 var socialUrl = ko.computed(function(element) {
	 	return '#/patient/socialandfamily/' + patientId();
	 });
	 // Service Record url generator
	 var serviceUrl = ko.computed(function(element) {
	 	return '#/patient/servicerecord/' + patientId();
	 });
	 // Follow Up url generator
	 var followupUrl = ko.computed(function(element) {
	 	return '#/patient/followup/' + patientId();
	 });
	 
	 // Service Record View url generator
	 var serviceviewUrl = function(element) {
		return '#/patient/servicerecord/serviceview/' + patientId() + '/' + element.date();
	 };
	 // History Present Illness url generator
	 var historyUrl = function(element) {
		return '#/patient/servicerecord/history/' + patientId() + '/' + element.date();
	 };
	 // Physical Examinations url generator
	 var physicalUrl = function(element) {
		return '#/patient/servicerecord/physical/' + patientId() + '/' + element.date();
	 };
	 // Labs & X-ray Reports url generator
	 var reportUrl = function(element) {
		return '#/patient/servicerecord/report/' + patientId() + '/' + element.date();
	 };
	 // Diagnosis Plan and Instructions url generator
	 var diagnosisUrl = function(element) {
		return '#/patient/servicerecord/diagnosis/' + patientId() + '/' + element.date();
	 };
	 // Orders url generator
	 var orderUrl = function(element) {
		return '#/patient/servicerecord/order/' + patientId() + '/' + element.date();
	 };
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
		form: form,
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
		date: date,
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
            if(data.length > 3)
            	self.date(data.date);
            
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
					var s = $.map(data, function(item) {return new self.structures.ServiceRecord(item)});
					self.serviceRecords(s);
				}
			});

			return backend.getPatient(self.patientId(), self.practiceId()).success(function(data) {
				if(data.length > 0) {
					var p = new self.structures.Patient(data[0]);
					self.patient(p);
				}
			});
		},
		openClose: function(data, element) {
			var e = $(element.currentTarget);
			var i = e.attr('class').toLowerCase().indexOf('plus');
			e.parent().next().slideToggle();
			if (i >= 0) {
				e.removeClass().addClass('icon-minus');
			}
			else {
				e.removeClass().addClass('icon-plus');
			}
		},
		toggleChild: function(data, event) {
			var e = $(event.currentTarget);
			e.toggleClass('icon-minus').toggleClass('icon-plus');
			e.parent().parent().parent().find('> .child').slideToggle();
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