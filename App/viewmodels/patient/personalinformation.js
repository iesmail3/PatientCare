/***************************************************************************************************
 * ViewModel: PersonalInformation & Insurance
 * Author(s): Gary Chang, Imran Esmail, and Sean Malone
 * Description: Handles the business logic for the Personal Information section of the patient
 *              patient record. This includes the Personal Information and Insurance tabs.
 **************************************************************************************************/

define(function(require) {    
	/*********************************************************************************************** 
	 * Includes
	 **********************************************************************************************/
	var system = require('durandal/system');				// System logger
	var custom = require('durandal/customBindings');		// Custom bindings
	var Backend = require('modules/personalinformation');   // Database access
	var Forms = require('modules/form');					// Common form elements
	var router = require('durandal/plugins/router');    	// Router
	var Structures = require('modules/patientStructures');  // Patient Structures
	
	/*********************************************************************************************** 
	 * Validation Configuration
	 **********************************************************************************************/
	ko.validation.init({
		insertMessages: false,
		parseInputAttributes: true,
		grouping: {deep: true, observable: true},
		decorateElement: true,
		messagesOnModified: false
	});
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	var backend = new Backend();
	var structures = new Structures();
	var insuredPerson 		= ko.observable();
	var primaryInsurance 	= ko.observable(new structures.Insurance());
	var secondaryInsurance  = ko.observable(new structures.Insurance());
	var otherInsurance 		= ko.observable(new structures.Insurance());
	var patientId 			= ko.observable();
	var practiceId			= ko.observable();
	var patient				= ko.observable(new structures.Patient());
	var guarantor 			= ko.observable(new structures.Guarantor());
	var employer			= ko.observable(new structures.Employer());
	var spouse				= ko.observable(new structures.Spouse());
	var addressEnable		= ko.observable("given");
	var employerEnable		= ko.observable();
	var personalEmployer	= ko.observable();
	var referencePhysician	= ko.observable(new structures.Reference());
	var referencePcp		= ko.observable(new structures.Reference());
	var referenceOther		= ko.observable(new structures.Reference());
	var referencePersonal	= ko.observable(new structures.Reference());

	/*********************************************************************************************** 
	 * ViewModel
	 **********************************************************************************************/
	var vm =  {
		/******************************************************************************************* 
		 * Attributes
		 *******************************************************************************************/
		form: new Forms(),
		backend: backend,
		structures: structures,
		patientId: patientId,
		practiceId: practiceId,
		patient: patient,
		insuredPerson: insuredPerson,
		primaryInsurance: primaryInsurance,
		secondaryInsurance: secondaryInsurance,
		otherInsurance: otherInsurance,
		guarantor: guarantor,
		employer: employer,
		spouse: spouse,
		addressEnable: addressEnable,
		employerEnable: employerEnable,
		personalEmployer: personalEmployer,
		referencePhysician: referencePhysician,
		referencePcp: referencePcp,
		referenceOther: referenceOther,
		referencePersonal: referencePersonal,
		/******************************************************************************************* 
		 * Methods
		 *******************************************************************************************/
		// This allow manipulation of the DOM
		viewAttached: function() {
			$('#personalTab a').click(function(e) {
				e.preventDefault();
  				$(this).tab('show');
			});
			
			$('.outerPane').height(parseInt($('.contentPane').height()) - 62);
			$('.formScroll').height(parseInt($('.tab-pane').height()) - 62);
			$(window).resize(function() {
				$('.outerPane').height(parseInt($('.contentPane').height()) - 62);
				$('.formScroll').height(parseInt($('.tab-pane').height()) - 62);
			});
		}, // End viewAttached
		// Loads when view is loaded
		activate: function(data) {
			var self = this;
			
			// Patient ID
			self.patientId(data.patientId);
			self.practiceId('1');
			self.patient().practiceId(self.practiceId());
			
			/**************************************************************************************
			 * Personal Information
			 * 
			 * Query the patient table to retrive peronsonal information for the patient.
			 *************************************************************************************/
			backend.getPatient(self.patientId(), self.practiceId()).success(function(data) {
				if(data.length > 0) {
					var p = new structures.Patient(data[0]);
					p.practiceId(self.practiceId());
					self.patient(p);
				}
			});
			
			if(self.patientId() == 'new') {
				self.patient(new structures.Patient());
				self.patient().practiceId(self.practiceId());
				// Set Validation
			}
			
			/**************************************************************************************
			 * Gurantor Information
			 * 
			 * Query the insurance table to see if there exists an entry for a guarantor for
			 * the patient. If there does, then set insuredPerson to other and populate guarantor
			 * obsevable. If not, then set insuredPerson to self. Will check if insurance 
			 * information exists in getInsurance.
			 *************************************************************************************/ 
			backend.getGuarantor(self.patientId()).success(function(data) {
				if(data.length > 0) {
					// Guarantor
					var g = new structures.Guarantor(data[0]);
					self.guarantor(g);
					
					// Employer
					if(self.guarantor().employer().length > 1)
						self.employerEnable('given');
					else
						self.employerEnable('na');
					
					// Address
					if(self.guarantor().address().length > 1)
						self.addressEnable('given');
					else
						self.addressEnable('same');
					
					self.insuredPerson(3);
				}
				else
					self.insuredPerson(1);
			});
			
			/**************************************************************************************
			 * Employer Information
			 * 
			 * If no employer information is returned, set insuredPerson to not insured. Otherwise
			 * for each type of insurance, set appropriate observable.
			 *************************************************************************************/
			backend.getEmployer(self.patientId()).success(function(data) {
				if(data.length > 0) {
					var e = new structures.Employer(data[0]);
					self.employer(e);
					self.personalEmployer(1);
				}
				else
					self.personalEmployer(0);
			});
			
			/**************************************************************************************
			 * Spouse Information
			 * 
			 * If no spouse information is returned, set insuredPerson to not insured. Otherwise
			 * for each type of insurance, set appropriate observable.
			 *************************************************************************************/
			backend.getSpouse(self.patientId()).success(function(data) {
				if(data.length > 0) {
					var s = new structures.Spouse(data[0]);
					self.spouse(s);
				}
			});
			
			/**************************************************************************************
			 * Reference Information
			 * 
			 * If no reference information is returned, set insuredPerson to not insured. Otherwise
			 * for each type of insurance, set appropriate observable.
			 *************************************************************************************/
			backend.getReference(self.patientId()).success(function(data) {
				if(data.length > 0) {
					for(var count = 0; count < data.length; count++) {
						var i = new structures.Reference(data[count]);
						
						switch(i.type()) {
							case 'referringphysician':
								self.referencePhysician(i);
								break;
							case 'pcp':
								self.referencePcp(i);
								break;
							case 'personalreference':
								self.referencePersonal(i);
								break;
							default:
								self.referenceOther(i);
								break;
						}
					}
				}
			});
			
			/**************************************************************************************
			 * Insurance Information
			 * 
			 * If no insurance information is returned, set insuredPerson to not insured. Otherwise
			 * for each type of insurance, set appropriate observable.
			 *************************************************************************************/
			return backend.getInsurance(self.patientId()).success(function(data) {
				if(data.length > 0) {
					for(var count = 0; count < data.length; count++) {
						var i = new structures.Insurance(data[count]);
						
						switch(i.type()) {
	            			case 'primary':
	            				self.primaryInsurance(i);
	            				break;
	            			case 'secondary':
	            				self.secondaryInsurance(i);
	            				break;
	            			default:
	            				self.otherInsurance(i);
	            				break;
	            		}
	            	}
				}
				else
					self.insuredPerson(2);
			});
		}, // End activate
		clickPersonal: function(data) {
			var self = this;
			if(self.patient().errors().length == 0) {
				alert('thank you');
			/*
			self.backend.savePatient(self.patientId(), self.patient()).complete(function(data) {
				if(data.responseText != "" && data.responseText != "failUpdate") {
					self.patientId($.parseJSON(data.responseText)[0].id);
					router.navigateTo('#/patient/personalinformation/' + (parseInt(self.patientId()) + 1));
				}
			});
			*/
			}
			else {
				$('.personalAlert').fadeIn('slow').delay(2000).fadeOut('slow');
				system.log(ko.validation);
				self.errors.showAllMessages();
			}
		}
	}; // End ViewModel
	
	// Turn validation on
	var errors = vm['formErrors'] = ko.validation.group(vm);
	vm.patient().errors.showAllMessages();
	return vm;
}); // End file