define(function(require) {
	/*********************************************************************************************** 
	* Includes
	**********************************************************************************************/
	var system = require('durandal/system');
	var Backend = require('modules/patient');
	var app = require('durandal/app');
	var Structures = require('modules/patientStructures');	// Structures
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	var backend = new Backend();
	var structures = new Structures();
	var keyword = ko.observable();
	var context = ko.observable();
	var parameter = ko.observable();
	var patients = ko.observableArray([]);
	var allPatients = ko.observableArray([]);
	
	var filterPatient = function(patient) {
		if (keyword() == undefined || keyword() == '') {
			return true;
		}
		else {
			var param = parameter();
			var con = context();
			var reg = '';
			switch(con) {
				case 'startsWith':
					reg = new RegExp("^" + keyword().toLowerCase());
					break;
				case 'endsWith':
					reg = new RegExp(keyword().toLowerCase() + "$");
					break;
				default:
					reg = new RegExp(keyword().toLowerCase() + "+");
					break;
			}
			     
			if(param != '') {
				var check = patient[param]();
				if (check.match(reg))
					return true;
			}
			else if(patient['firstName']().toLowerCase().match(reg) || 
				    patient['lastName']().toLowerCase().match(reg) ||
				    patient['middleName']().toLowerCase().match(reg) || 
				    patient['alias']().toLowerCase().match(reg) ||
				    patient['gender']().toLowerCase().match(reg) || 
				    patient['city']().toLowerCase().match(reg) ||
				    patient['state']().toLowerCase().match(reg) || 
				    patient['country']().toLowerCase().match(reg) ||
				    patient['phone']().toLowerCase().match(reg) || 
				    patient['email']().toLowerCase().match(reg) ||
				    patient['mobile']().toLowerCase().match(reg)) 
			{
				return true
			}
			
			return false;
		}
	};
	
	/*********************************************************************************************** 
	 * Computed Functions
	 **********************************************************************************************/
	
	/*********************************************************************************************** 
	 * Manage Patients ViewModel
	 **********************************************************************************************/
	return {
		backend: backend,
		keyword: keyword,
		context: context,
		parameter: parameter,
		patients: patients,
		allPatients: allPatients,
		viewAttached: function() {
			// Change the selected nav item 
			$('.navItem').removeClass('active');
			$('.patientNav').addClass('active');
		},
		activate: function(data) {
			var self = this;
			
			return backend.getPatients().success(function(data) {
				var patient = $.map(data, function(item) {return new structures.Patient(item) });
				self.patients(patient);
				self.allPatients(patient);
			});
		},
		filterPatient: filterPatient,
		clearFields: function() {
			var self = this;
			self.keyword('');
			self.context('contains');
			self.parameter('');
		},
		deletePatient: function(item, test) {
			return app.showMessage(
				'Are you sure you want to delete ' + item.firstName() + ' ' + item.lastName() + '?', 
				'Delete', 
				['Yes', 'No'])
			.done(function(answer){
				if(answer == 'Yes') {
					backend.deletePatient(item.id()).complete(function(data) {
						if(data.responseText == 'fail') {
							app.showMessage('The patient could not be deleted.', 'Deletion Error');
						}
						else
							patients.remove(item);
					});
				}
			});
		}
	};
});
