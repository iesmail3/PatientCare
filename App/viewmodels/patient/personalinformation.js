/***************************************************************************************************
 * ViewModel: PersonalInformation & Insurance
 * Author(s): Gary Chang, Imran Esmail, and Sean Malone
 * Description: Handles the business logic for the Personal Information section of the patient
 *              record. This includes the Personal Information and Insurance tabs.
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
	var UserStructures = require('modules/structures');		// User Structures
	var modal	   = require('modals/modals');				// Modals
	var app = require('durandal/app');
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	var self;
	var backend = new Backend();
	var structures = new Structures();
	var userStructures = new UserStructures();
	var form = new Forms();
	var user				= ko.observable(new userStructures.User());
	var role				= ko.observable(new userStructures.Role());
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
	var isArchive           = ko.observable(false);
	var tempPrimaryInsurance       = ko.observable(); 
	var tempSecondaryInsurance       = ko.observable();
	var tempOtherInsurance       = ko.observable();
	/*********************************************************************************************** 
	 * ViewModel
	 **********************************************************************************************/
	return  {
		/******************************************************************************************* 
		 * Attributes
		 *******************************************************************************************/
		backend: backend,
		user: user,
		role: role,
		form: form,
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
		isArchive: isArchive,
		tempPrimaryInsurance: tempPrimaryInsurance,
		tempSecondaryInsurance: tempSecondaryInsurance,
		tempOtherInsurance: tempOtherInsurance,
		/******************************************************************************************* 
		 * Methods
		 *******************************************************************************************/
		// This allow manipulation of the DOM
		viewAttached: function() {
			$('#personalTab a').click(function(e) {
				e.preventDefault();
  				$(this).tab('show');
			});
			
			setTimeout(function() {
				$('.outerPane').height(parseInt($('.contentPane').height()) - 62);
				$('.formScroll').height(parseInt($('.tab-pane').height()) - 62);
			}, 100);
			$(window).resize(function() {
				$('.outerPane').height(parseInt($('.contentPane').height()) - 62);
				$('.formScroll').height(parseInt($('.tab-pane').height()) - 62);
			});
		}, // End viewAttached
		// Loads when view is loaded
		activate: function(data) {
			self = this;
			
			backend.getRole(global.userId, global.practiceId).success(function(data) {
				self.role(new userStructures.Role(data[0]));
			});

			// Reset all observables
			user				(new userStructures.User());
			role				(new userStructures.Role());
			primaryInsurance 	(new structures.Insurance());
			secondaryInsurance  (new structures.Insurance());
			otherInsurance 		(new structures.Insurance());
			patient				(new structures.Patient());
			guarantor 			(new structures.Guarantor());
			employer			(new structures.Employer());
			spouse				(new structures.Spouse());
			referencePhysician	(new structures.Reference());
			referencePcp		(new structures.Reference());
			referenceOther		(new structures.Reference());
			referencePersonal	(new structures.Reference());
			
			// Patient ID
			self.patientId(data.patientId);
			self.practiceId(global.practiceId);	// Comes from app.php in Scripts section
			self.patient().practiceId(self.practiceId());
			primaryInsurance().type('primary');
			secondaryInsurance().type('secondary');
			otherInsurance().type('other');
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
			}
			
			/**************************************************************************************
			 * Gurantor Information
			 * 
			 * Query the insurance table to see if there exists an entry for a guarantor for
			 * the patient. If there does, then set insuredPerson to other and populate guarantor
			 * obsevable. If not, then set insuredPerson to self. Will check if insurance 
			 * information exists in getInsurance.
			 *************************************************************************************/ 
			backend.getGuarantor(self.patientId(), self.practiceId()).success(function(data) {
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
			backend.getEmployer(self.patientId(), self.practiceId()).success(function(data) {
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
			backend.getSpouse(self.patientId(), self.practiceId()).success(function(data) {
				if(data.length > 0) {
					var s = new structures.Spouse(data[0]);
					if(s.dob() == '0000-00-00')
						s.dob('');
					else
						s.dob(form.uiDate(s.dob()));
					self.spouse(s);
				}
			});
			
			/**************************************************************************************
			 * Reference Information
			 * 
			 * If no reference information is returned, set insuredPerson to not insured. Otherwise
			 * for each type of insurance, set appropriate observable.
			 *************************************************************************************/
			backend.getReference(self.patientId(), self.practiceId()).success(function(data) {
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
			return backend.getInsurance(self.patientId(), self.practiceId()).success(function(data) {
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
		printPersonal: function(data) {
			var height = $('.flowHolder').height();
			var settings = 'directories=no, height=' + height + ', width=800, location=yes, ' +
				   'menubar=no, status=no, titlebar=no, toolbar=no';
			var win = window.open(
				'php/printPersonalInformation.php/?practiceId=' + 
				practiceId() + '&patientId=' + patientId(),
				'',
				settings
			);
		},
		savePersonal: function(data) {
			var self = this;
			var success = false;
			if(self.patient().errors().length == 0) {
				// Patient
				self.backend.savePatient(self.patientId(), self.patient()).complete(function(data) {
					if(data.responseText != "" && data.responseText != "failUpdate" && 
					   data.responseText.toLowerCase().indexOf('update') < 0) {
						self.patientId(parseInt($.parseJSON(data.responseText)[0].id) + 1);
						success = true;
					}
					else if(data.responseText == 'updateSuccess')
						$('.alert-success').fadeIn().delay(3000).fadeOut();
					
					// If the patient is successfully saved, save the individual components
					// of Peronsal information.
					if(data.responseText.toLowerCase().indexOf('insertfail') < 0) {
						// Employer
						if(personalEmployer() == 1) {
							var m = employer().patientId() == undefined ? 'insert' : 'update';
							employer().patientId(patientId());
							employer().practiceId(practiceId());
							backend.saveEmployer(employer(), m, self.practiceId());	
						}
						else {
							backend.deleteEmployer(self.patientId(), self.practiceId());
							$('.alert-success').fadeIn().delay(3000).fadeOut();
						}
						
						// Spouse
						if(patient().maritalStatus() == 'married' || patient().maritalStatus() == 'separated') {
							var m = spouse().patientId() == undefined ? 'insert' : 'update';
							spouse().patientId(patientId());
							spouse().practiceId(practiceId());
							backend.saveSpouse(spouse(), m, self.practiceId());	
						}
						else {
							backend.deleteSpouse(self.patientId(), self.practiceId());
						}
						
						// References
						if(referencePhysician().firstName() != undefined || referencePhysician().lastName() != undefined) {
							var m = referencePhysician().patientId() == undefined ? 'insert' : 'update';
							referencePhysician().patientId(patientId());
							referencePhysician().practiceId(practiceId());
							referencePhysician().type('referringphysician');
							backend.saveReference(referencePhysician(), m, self.practiceId());
						}
						else {
							backend.deleteReference(self.referencePhysician().id(), self.practiceId());
						}
						
						if(referencePcp().firstName() != undefined || referencePcp().lastName() != undefined) {
							var m = referencePcp().patientId() == undefined ? 'insert' : 'update';
							referencePcp().patientId(patientId());
							referencePcp().practiceId(practiceId());
							referencePcp().type('pcp');
							backend.saveReference(referencePcp(), m, self.practiceId());
						}
						else {
							backend.deleteReference(self.referencePcp().id(), self.practiceId());
						}
						
						if(referencePersonal().firstName() != undefined || referencePersonal().lastName() != undefined) {
							var m = referencePersonal().patientId() == undefined ? 'insert' : 'update';
							referencePersonal().patientId(patientId());
							referencePersonal().practiceId(practiceId());
							referencePersonal().type('personalreference');
							backend.saveReference(referencePersonal(), m, self.practiceId());
						}
						else {
							backend.deleteReference(self.referencePersonal().id(), self.practiceId());
						}
						
						if(referenceOther().firstName() != undefined || referenceOther().lastName() != undefined) {
							var m = referenceOther().patientId() == undefined ? 'insert' : 'update';
							referenceOther().patientId(patientId());
							referenceOther().practiceId(practiceId());
							referenceOther().type('other');
							backend.saveReference(referenceOther(), m, self.practiceId());
						}
						else {
							backend.deleteReference(self.referenceOther().id(), self.practiceId());
						}
						$('.alert-success').fadeIn().delay(3000).fadeOut();
					}
				});
				
				// Reload page
				setTimeout(function() {
					if(success)
						router.navigateTo('#/patient/personalinformation/' + (self.patientId()));
				}, 500);
			}
			else
				$('.allAlert').fadeIn('slow').delay(2000).fadeOut('slow');
		},
		printInsurance: function(data) { 
			modal.showInsurance(patient().firstName(),patient().lastName(),practiceId(),patientId(),'Insurance Archive Records');  
		},
		clearForm: function(data) { 
			return app.showMessage(
				'You are going to replace current record with new details.Old details will be archived,are you sure?', 
				'Replace Insurance Record', 
				['Yes', 'No'])
			.done(function(answer){
				if(answer == 'Yes') {
					isArchive(true); 
				   $('.archiveButton').text('Archived').attr('disabled', true);
				   tempPrimaryInsurance(primaryInsurance()); 
				   tempSecondaryInsurance(secondaryInsurance()); 
				   tempOtherInsurance(otherInsurance()); 
				   primaryInsurance(new structures.Insurance());
				   secondaryInsurance(new structures.Insurance());
				   otherInsurance(new structures.Insurance());
				   primaryInsurance().verificationTime(''); 
				   secondaryInsurance().verificationTime(''); 
				   otherInsurance().verificationTime(''); 
				   //set the archive dates 
				   tempPrimaryInsurance().archiveDate(form.dbDate(form.currentDate())); 
				   tempSecondaryInsurance().archiveDate(form.dbDate(form.currentDate())); 
				   tempOtherInsurance().archiveDate(form.dbDate(form.currentDate())); 
				   //save the Insurances
				   backend.saveInsurance(tempPrimaryInsurance(),patientId(),practiceId());
				   backend.saveInsurance(tempSecondaryInsurance(),patientId(),practiceId());
				   backend.saveInsurance(tempOtherInsurance(),patientId(),practiceId());
				   
				}
			}); 
		},
		showInsuranceForm: function(data) {
			if(isArchive()) {
				return app.showMessage(
					'Any current changes will be lost,are you sure?', 
					'Reload Insurance Record', 
					['Yes', 'No'])
				.done(function(answer){
					if(answer == 'Yes') {
						primaryInsurance(tempPrimaryInsurance());
						secondaryInsurance(tempSecondaryInsurance());
						otherInsurance(tempOtherInsurance());
						tempPrimaryInsurance(new structures.Insurance());
						tempSecondaryInsurance(new structures.Insurance());
						tempOtherInsurance(new structures.Insurance());
						$('.archiveButton').text('Archive').attr('disabled', false);
						isArchive(false); 
					}
				});
			}
		},
		saveInsurance: function(data) { 
			if(primaryInsurance().errors().length > 0) {
				if(primaryInsurance().errors().length > 1) {
					$('.primaryInsurance .allAlert').fadeIn().delay(3000).fadeOut();
				}
				else if(primaryInsurance().errors()[0] == 'group') {
					$('.primaryInsurance .groupAlert').fadeIn().delay(3000).fadeOut();
				}
				else if(primaryInsurance().errors()[0] == 'policy') {
					$('.primaryInsurance .policyAlert').fadeIn().delay(3000).fadeOut();
				}
				else if(primaryInsurance().errors()[0] == 'company') {
					$('.primaryInsurance .companyAlert').fadeIn().delay(3000).fadeOut();
				}
			}
			else { 
				backend.saveInsurance(primaryInsurance(),patientId(),practiceId()); 
				backend.saveInsurance(secondaryInsurance(),patientId(),practiceId()); 
				backend.saveInsurance(otherInsurance(),patientId(),practiceId()); 
				$('.primaryInsurance .insuranceAlert').fadeIn().delay(3000).fadeOut();
			}
		}
	}; // End ViewModel
}); // End file