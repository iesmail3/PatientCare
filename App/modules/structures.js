/**************************************************************************************************
 * Module name: Structures
 * Author(s): Sean Malone
 * Description: Contains structures for all the root level view models
 *************************************************************************************************/
define(function(require) {
	/**************************************************************************************************
	 * Constructor
	 *************************************************************************************************/
	function structures () {}
	
	/**************************************************************************************************
	 * User
	 *************************************************************************************************/
	structures.prototype.User = function(data) {
		var self = this;
		if(data != null) {
			this.id 		   		= ko.observable(data.id);
			this.practiceId 		= ko.observable(data.practice_id);
			this.username			= ko.observable(data.username);
			this.password			= ko.observable(data.password);
			this.firstName   		= ko.observable(data.first_name);
			this.lastName			= ko.observable(data.last_name);
			this.email				= ko.observable(data.email);
			this.roleId				= ko.observable(data.role_id);
			this.roleName			= ko.observable(data.name);
			this.roleDescription	= ko.observable(data.description);
		}
		else {
			this.id 		   		= ko.observable();
			this.practiceId 		= ko.observable();
			this.username			= ko.observable();
			this.password			= ko.observable();
			this.firstName   		= ko.observable();
			this.lastName			= ko.observable();
			this.email				= ko.observable();
			this.roleId				= ko.observable();
			this.roleName			= ko.observable();
			this.roleDescription	= ko.observable();
		}
	}
	
	/**************************************************************************************************
	 * Role
	 *************************************************************************************************/
	structures.prototype.Role = function(data) {
		var self = this;
		if(data != null) {
			this.id 		   		 	= ko.observable(data.id);
			this.practiceId 		 	= ko.observable(data.practice_id);
			this.name				 	= ko.observable(data.name);
			this.description			= ko.observable(data.description);
			this.superbill				= ko.observable(data.superbill);
			this.allergies				= ko.observable(data.allergies);
			this.birthHistory			= ko.observable(data.birth_history);
			this.clinicDetails			= ko.observable(data.clinicDetails);
			this.changePassword			= ko.observable(data.change_password);
			this.checkout				= ko.observable(data.checkout);
			this.copayCollection		= ko.observable(data.copay_collection);
			this.development			= ko.observable(data.development);
			this.diagnosis				= ko.observable(data.diagnosis);
			this.familyHistory			= ko.observable(data.family_history);
			this.followup				= ko.observable(data.follow_up);
			this.guidance				= ko.observable(data.guidance);
			this.history				= ko.observable(data.history);
			this.historyIllness			= ko.observable(data.history_illness);
			this.immunization			= ko.observable(data.immunization);
			this.instructions			= ko.observable(data.instructions);
			this.insurance				= ko.observable(data.instructions);
			this.insuranceVerification	= ko.observable(data.insurance_verification);
			this.reports				= ko.observable(data.reports);
			this.managePatients			= ko.observable(data.manage_patients);
			this.managePhysician		= ko.observable(data.manage_physician);
			this.managePracticeType		= ko.observable(data.manage_practice_type);
			this.manageReasonCode		= ko.observable(data.manage_reason_code);
			this.manageRoles			= ko.observable(data.manage_roles);
			this.manageSchedule			= ko.observable(data.manage_schedule);
			this.manageUsers			= ko.observable(data.manage_users);
			this.medicalProblem			= ko.observable(data.medical_problems);
			this.medication				= ko.observable(data.medication);
			this.medicationOrders		= ko.observable(data.medication_orders);
			this.miscDocs				= ko.observable(data.misc_docs);
			this.orders					= ko.observable(data.orders);
			this.otherOptions			= ko.observable(data.other_options);
			this.personalInformation	= ko.observable(data.personal_information);
			this.phoneLog				= ko.observable(data.phone_log);
			this.physicalExamination	= ko.observable(data.physical_examination);
			this.prescription			= ko.observable(data.prescription);
			this.reviewOfSystems		= ko.observable(data.review_of_systems);
			this.routineExam			= ko.observable(data.routine_exam);
			this.security				= ko.observable(data.security);
			this.serviceRecord			= ko.observable(data.service_record);
			this.socialHistory			= ko.observable(data.social_history);
			this.patientSuperbill		= ko.observable(data.patient_superbill);
			this.vitalSigns				= ko.observable(data.vital_signs);
			this.diagnosisInstructions	= ko.observable(data.diagnosis_instructions);
			this.physicalExaminationSub	= ko.observable(data.physical_examination_sub);
		}
		else {
			this.id 		   		 	= ko.observable();
			this.practiceId 		 	= ko.observable();
			this.name				 	= ko.observable();
			this.description		 	= ko.observable();
			this.superbill				= ko.observable();
			this.allergies				= ko.observable();
			this.birthHistory			= ko.observable();
			this.clinicDetails			= ko.observable();
			this.changePassword			= ko.observable();
			this.checkout				= ko.observable();
			this.copayCollection		= ko.observable();
			this.development			= ko.observable();
			this.diagnosis				= ko.observable();
			this.familyHistory			= ko.observable();
			this.followup				= ko.observable();
			this.guidance				= ko.observable();
			this.history				= ko.observable();
			this.historyIllness			= ko.observable();
			this.immunization			= ko.observable();
			this.instructions			= ko.observable();
			this.insurance				= ko.observable();
			this.insuranceVerification	= ko.observable();
			this.reports				= ko.observable();
			this.managePatients			= ko.observable();
			this.managePhysician		= ko.observable();
			this.managePracticeType		= ko.observable();
			this.manageReasonCode		= ko.observable();
			this.manageRoles			= ko.observable();
			this.manageSchedule			= ko.observable();
			this.manageUsers			= ko.observable();
			this.medicalProblem			= ko.observable();
			this.medication				= ko.observable();
			this.medicationOrders		= ko.observable();
			this.miscDocs				= ko.observable();
			this.orders					= ko.observable();
			this.otherOptions			= ko.observable();
			this.personalInformation	= ko.observable();
			this.phoneLog				= ko.observable();
			this.physicalExamination	= ko.observable();
			this.prescription			= ko.observable();
			this.reviewOfSystems		= ko.observable();
			this.routineExam			= ko.observable();
			this.security				= ko.observable();
			this.serviceRecord			= ko.observable();
			this.socialHistory			= ko.observable();
			this.patientSuperbill		= ko.observable();
			this.vitalSigns				= ko.observable();
			this.diagnosisInstructions	= ko.observable();
			this.physicalExaminationSub	= ko.observable();
		}
	}
	
	/**************************************************************************************************
	 * Return class so it is usable.
	 *************************************************************************************************/
	return structures;
});