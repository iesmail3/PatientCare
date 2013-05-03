/**************************************************************************************************
 * ViewModel: Manage Patients
 * Author: Gary Chang
 * Description: This ViewModel contains all of the logic for the managePatients view.
 *************************************************************************************************/
define(function(require) {
	/*********************************************************************************************** 
	* Includes
	**********************************************************************************************/
	var system 		= require('durandal/system');				// System
	var Backend 	= require('modules/patient');				// Patient Module
	var app 		= require('durandal/app');					// App
	var Structures 	= require('modules/patientStructures');		// Patient Structure
	var User	   	= require('modules/structures');			// User Structure
	
	/********************************************************************************************** 
	 * KO Observables
	 *********************************************************************************************/
	var self;
	var backend = new Backend();
	var structures = new Structures();
	var userStructure = new User();
	var user = ko.observable();
	var role = ko.observable();
	var userId = ko.observable();
	var practiceId = ko.observable();
	var keyword = ko.observable();
	var context = ko.observable();
	var parameter = ko.observable();
	var patients = ko.observableArray([]);
	var allPatients = ko.observableArray([]);
	
	/*********************************************************************************************** 
	 * Manage Patients ViewModel
	 **********************************************************************************************/
	return {
		user: user,
		role: role,
		userId: userId,
		practiceId: practiceId,
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
			self = this;
			self.userId(global.userId);
			self.practiceId(global.practiceId);
			
			return backend.getRole(self.userId(), self.practiceId()).success(function(data) {
				self.role(new userStructure.Role(data[0]));
				if(self.role().managePatients() == 0) {
					// There is currently no dashboard, so if the user doensn't have viewing
					// permissions then they wouldn't see Patients. Since Patients is the only
					// Area available now, it is being left alone for testing purposes.
					// NEEDS TO BE IMPLEMENTED WHEN DASHBOARD IS CREATED
					system.log('No permissions');
					
				}
			}).then(function() {			
				backend.getPatients().success(function(data) {
					var patient = $.map(data, function(item) {return new structures.Patient(item) });
					self.patients(patient);
					self.allPatients(patient);
				});
			});
		},
		// Filter Patients
		filterPatient: function(patient) {
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
		},
		// Clear Filter fields
		clearFields: function() {
			var self = this;
			self.keyword('');
			self.context('contains');
			self.parameter('');
		},
		// Delete Patient
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