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
	var Backend = require('modules/patient');			// Module
	
	
	// Structures are like classses. They need to be capitalized.
	
	// Followup is one word. No need to capitalize it.
	// Followup
	function Followup(data){ 
		var self = this; 
		
		if(data!= null) { 
			self.patientId      = ko.observable(data.patient_id); 
			self.followupType 	= ko.observable(data.type); 
			self.value 	   		= ko.observable(data.value); 
			self.unit 			= ko.observable(data.unit); 
			self.comment 		= ko.observable(data.comment); 
			self.plan           = ko.observable(data.plan); 
			self.serviceDate    = ko.observable(data.service_date); 
		}
		else {				
			self.patientId      = ko.observable(); 
			self.followupType 	= ko.observable(); 
			self.value 			= ko.observable(); 
			self.unit 			= ko.observable(); 
			self.comment 		= ko.observable();
			self.plan           = ko.observable(); 
			self.serviceDate    = ko.observable();  			
		}
	}
	
	// CheckOut
	function CheckOut(data) { 
		var self = this; 
			
		if(data != null) { 
			self.id                	    = ko.observable(data.id); 
			self.patientId         		= ko.observable(data.patient_id);
			self.primaryInsurance      	= ko.observable(data.primary_insurance); 
			self.secondaryInsurance 	= ko.observable(data.secondary_insurance); 
			self.otherInsurance        	= ko.observable(data.other_insurance); 
			self.date  					= ko.observable(data.date); 
			self.copayAmount			= ko.observable(data.copay_amount); 
			self.otherCopay				= ko.observable(data.other_copay); 
			self.additionalCharges 		= ko.observable(data.additional_charges); 
			self.insurancePortion 		= ko.observable(data.insurance_portion); 
			self.totalReceivable       	= ko.observable(data.total_receivable); 
			self.totalPayment          	= ko.observable(data.total_payment); 
			self.balance   				= ko.observable(data.balance); 
			self.comment 				= ko.obsevable(data.comment); 
				
		}
		else {
		    self.id                	    = ko.observable(); 
			self.patientId         		= ko.observable(); 
			self.primaryIsurance     	= ko.observable(); 
			self.secondaryInsurance 	= ko.observable(); 
			self.otherInsurance        	= ko.observable(); 
			self.date  					= ko.observable(); 
			self.copayAmount			= ko.observable(); 
			self.otherCopay				= ko.observable(); 
			self.additionalCharges 		= ko.observable();     
			self.insurancePortion 		= ko.observable(); 
			self.totalReceivable      	= ko.observable(); 
			self.totalPayment          	= ko.observable(); 
			self.balance   				= ko.observable(); 
			self.comment 				= ko.observable();  
		}
	}
	
	// Prescription
	function Prescription(data) {
		var self = this; 
		
		if(data!= null) { 
			self.patientid			= ko.observable(data.patient_id); 
			self.medicationOrderId  = ko.observable(data.medication_order_id); 
			self.comment            = ko.observable(data.comment); 
		}
		else { 
			self.patientId			= ko.observable(); 
			self.medicationOrderId  = ko.observable();   
			self.comment            = ko.observable(); 
		}
	}
	          
	// PhoneLog
	function PhoneLog(data) { 
		var self = this; 
		
		if(data!=null) { 
			self.id 			= ko.observable(data.id); 
			self.patientId      = ko.observable(data.patient_id); 	
			self.dateTime       = ko.observable(data.datetime); 
			self.caller         = ko.observable(data.caller); 
			self.attendedBy     = ko.observable(data.attended_by); 
			self.message        = ko.observable(data.message); 
			self.actionRequried = ko.observable(data.action_requried); 
			self.assignedTo     = ko.observable(data.assigned_to); 
			self.callType       = ko.observable(data.type); 
		}
		else {
			self.id 			= ko.observable(); 
			self.patientId      = ko.observable(); 	
			self.dateTime       = ko.observable(); 
			self.caller         = ko.observable(); 
			self.attendedBy     = ko.observable(); 
			self.message        = ko.observable(); 
			self.actionRequried = ko.observable(); 
			self.assignedTo     = ko.observable(); 
			self.callType       = ko.observable();  
		}
	}
	
	// Superbill is one word. No need to camelCase it.
	// Superbill
	function Superbill(data) { 
		var self = this; 
		
		if(data!=null) {
		    self.serviceRecordId	= ko.observable(data.self_record_id); 
			self.visitType          = ko.observable(data.visit_type); 
			self.visitCode          = ko.observable(data.visit_code); 
			self.levelOfService     = ko.observable(data.level_of_service); 
			self.serviceCode        = ko.observable(data.service_code); 
			self.isComplete         = ko.observable(data.is_complete); 			 
		}
		else {
		    self.serviceRecordId    = ko.observable(); 
			self.visitType          = ko.observable(); 
			self.visitCode          = ko.observable(); 
			self.levelOfService     = ko.observable(); 
			self.serviceCode        = ko.observable(); 
			self.isComplete         = ko.observable(); 
		}   
	}
	
	// You can probably just call this Document
	// Misc Doc 
	function MiscDoc(data) { 
		var self = this; 
		
		if(data != null) { 
		    self.id        		= ko.observable(data.id); 
		    self.patient_id     = ko.observable(data.patient_id); 
		    self.documentType   = ko.observable(data.type); 
		    self.DOS            = ko.observable(data.DOS); 
		    self.receivedDate   = ko.observable(data._date);
		    self.isReviewed     = ko.observable(data.is_reviewed);  
		    self.comment        = ko.observable(data.comment); 
	    }
	    else {
    		self.id             = ko.observable(); 
		    self.patient_id     = ko.observable(); 
		    self.documentType   = ko.observable(); 
		    self.DOS            = ko.observable(); 
		    self.receivedDate   = ko.observable();
		    self.isReviewed     = ko.observable();  
		    self.comment        = ko.observable(); 	    	
	    }
			    
	}
	
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	 var followup 		= ko.observable(new Followup());
	 var followups      = ko.observableArray([]); 
	 var checkOut 		= ko.observable(new CheckOut()); 
	 var phoneLog       = ko.observable(new PhoneLog()); 
	 var superBill      = ko.observable(new Superbill()); 
	 var prescription   = ko.observable(new Prescription());
	 var miscDoc        = ko.observable(new MiscDoc());  
	 var patientId      = ko.observable(); 
	/*********************************************************************************************** 
	 * KO Computed Functions
	 **********************************************************************************************/
	 // var computedFunction = ko.computed(function() {});

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
		followup: followup,
		followups:followups, 
		checkOut:checkOut, 
		phoneLog:phoneLog,
		superBill:superBill, 
		prescription:prescription,	
		miscDoc:miscDoc,
		patientId:patientId,
		/******************************************************************************************* 
		 * Methods
		 *******************************************************************************************/
		// This allow manipulation of the DOM
		viewAttached: function() {
			$('#followupTab a').click(function(e) {
				e.preventDefault();
  				$(this).tab('show');
			});
			
			// Resize tree and content pane
			$('.tab-pane').height(parseInt($('.contentPane').height()) - 62);
			$(window).resize(function() {
				$('.tab-pane').height(parseInt($('.contentPane').height()) - 62);
			});
		},
		// Loads when view is loaded
		activate: function(data) {
			var self = this; 
			
			//Patient ID
			self.patientId(data.patientId); 
			
			//Module Object 
			var backend = new Backend();
			
			var f = new Followup({
				patientId : 123, 
				followupType : 'testType', 
				value : 'testValue', 
				unit : 'kg', 
				comment : 'This is a test comment.', 
				plan : 'testPlan', 
				serviceDate : '01/02/2013'
			});
			
			self.followup(f);
			
			var temp = [
				new Followup({
					patientId : 123, 
					followupType : 'testType', 
					value : 'testValue', 
					unit : 'kg', 
					comment : 'This is a test comment.', 
					plan : 'testPlan', 
					serviceDate : '01/02/2013'
				}),
				new Followup({
					patientId : 123, 
					followupType : 'testType2', 
					value : 'testValue2', 
					unit : 'kg', 
					comment : 'This is also test comment.', 
					plan : 'testPlan2', 
					serviceDate : '01/03/2013'
				}),
				new Followup({
					patientId : 123, 
					followupType : 'testType3', 
					value : 'testValue3', 
					unit : 'lb', 
					comment : 'This is also test comment.', 
					plan : 'testPlan3', 
					serviceDate : '01/04/2013'
				})
			];
			    
			self.followups(temp);			
		},    
		    
		setFields:function(data) { 
				var self = this;      
				self.value(data.value);        
				self.unit(data.unit); 
				self.comment(data.comment); 
				
			}
	};
});