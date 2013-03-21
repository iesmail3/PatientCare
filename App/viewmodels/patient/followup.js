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
			//system.log(data.serviceDate);
			self.patientId      = ko.observable(data.patient_id); 
			self.type 			= ko.observable(data.type); 
			self.value 	   		= ko.observable(data.value); 
			self.unit 			= ko.observable(data.unit); 
			self.comment 		= ko.observable(data.comment); 
			self.plan           = ko.observable(data.plan); 
			self.serviceDate    = ko.observable(data.service_date); 
		}
		else {				
			self.patientId      = ko.observable(); 
			self.type 			= ko.observable(); 
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
			self.patientId         		= ko.observable(data.patient_id);
			self.primaryInsurance      	= ko.observable(data.primary_insurance); 
			self.secondaryInsurance 	= ko.observable(data.secondary_insurance); 
			self.otherInsurance        	= ko.observable(data.other_insurance); 
			self.date  					= ko.observable(data.date); 
			self.copayAmount			= ko.observable(data.copay_amount); 
			self.otherCopay				= ko.observable(data.other_copay); 
			self.additionalCharges 		= ko.observable(data.additional_charges);   
			self.editAdditionalCharge	= ko.observable((data.edit_additional_charge) == 'true');
			self.insurancePortion 		= ko.observable(data.insurance_portion); 
			self.totalReceivable       	= ko.observable(data.total_receivable); 
			self.totalPayment          	= ko.observable(data.total_payment); 
			self.balance   				= ko.observable(data.balance); 
			self.comment 				= ko.observable(data.comment); 
				
		}
		else {    
			self.patientId         		= ko.observable(); 
			self.primaryIsurance     	= ko.observable(); 
			self.secondaryInsurance 	= ko.observable(); 
			self.otherInsurance        	= ko.observable(); 
			self.date  					= ko.observable(); 
			self.copayAmount			= ko.observable(); 
			self.otherCopay				= ko.observable(); 
			self.additionalCharges 		= ko.observable();
			self.editAdditionalCharge   = ko.observable();      
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
			self.patientId      = ko.observable(data.patient_id); 	
			self.dateTime       = ko.observable(data.datetime); 
			self.caller         = ko.observable(data.caller); 
			self.attendedBy     = ko.observable(data.attended_by); 
			self.message        = ko.observable(data.message); 
			self.actionRequired = ko.observable(data.action_requried);   
			self.assignedTo     = ko.observable(data.assigned_to); 
			self.callType       = ko.observable(data.type); 
		}
		else { 
			self.patientId      = ko.observable(); 	
			self.dateTime       = ko.observable(); 
			self.caller         = ko.observable(); 
			self.attendedBy     = ko.observable(); 
			self.message        = ko.observable(); 
			self.actionRequired  = ko.observable(); 
			self.assignedTo     = ko.observable(); 
			self.callType       = ko.observable();  
		}
	}
	
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
	
	
	// Misc Doc 
	function Document(data) { 
		var self = this; 
		
		if(data != null) { 
		    self.patientId     = ko.observable(data.patient_id); 
		    self.documentType   = ko.observable(data.type);    
		    self.DOS            = ko.observable(data.DOS); 
		    self.receivedDate   = ko.observable(data.date);
		    self.isReviewed     = ko.observable(data.is_reviewed);  
		    self.comment        = ko.observable(data.comment); 
	    }
	    else {
		    self.patientId     = ko.observable(); 
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
	 var checkOuts      = ko.observableArray([]); 
	 var phoneLog       = ko.observable(new PhoneLog()); 
	 var phoneLogs      = ko.observableArray([]);    
	 var superBill      = ko.observable(new Superbill());    
	 var prescription   = ko.observable(new Prescription());
	 var doc            = ko.observable(new Document());
	 var documents      = ko.observableArray([]);         
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
		followups: followups, 
		checkOut: checkOut,
		checkOuts: checkOuts, 
		phoneLog: phoneLog,
		phoneLogs: phoneLogs, 
		superBill: superBill, 
		prescription: prescription,
		doc: doc,
		documents: documents, 
		patientId: patientId,
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
				
			var temp = [
				new Followup({
					patientId : 123, 
					type : '1', 
					value : '5', 
					unit : 'Weeks', 
					comment : 'This is a test comment.', 
					plan : 'testPlan', 
					service_date : '01/02/2013'
				}),
				new Followup({
					patientId : 123, 
					type : '1', 
					value : '6', 
					unit : 'Days', 
					comment : 'This is also test comment.', 
					plan : 'testPlan2', 
					service_date : '01/03/2013'
				}),
				new Followup({
					patientId : 123, 
					type : '2',   
					value : '1', 
					unit : 'Months', 
					comment : 'This is also test comment.',       
					plan : 'testPlan3',        
					service_date : '01/04/2013'    
				}),
				new Followup({
					patientId : 123, 
					type : '3',   
					value : 'None', 
					unit : '', 
					comment : '',       
					plan : 'testPlan4',        
					service_date : '02/13/2013'    
				}),
				new Followup({
					patientId : 123, 
					type : '4',   
					value : 'None', 
					unit : '', 
					comment : '',       
					plan : 'testPlan5',        
					service_date : '02/15/2013'    
				})
			]; 
			self.followups(temp);
			
			var chArray = [
			    new CheckOut({
						patientId : 123, 
						primary_insurance : '1',   
						secondary_insurance: '2',
						other_insurance: '3',   
						date : '02/13/2013' ,
						copay_amount : '120',
						other_copay : '30',
						additional_charges : '10', 
						insurance_portion : '50', 
						total_receivable : '25',   
						total_payment: '300', 
						balance : '100',  
						comment : 'This is a test comment.'
			}), 
			new CheckOut({
						patientId : 123, 
						primary_insurance : '1',   
						secondary_insurance: '2',
						other_insurance: '3',   
						date : '02/13/2013' ,
						copay_amount : '110',
						other_copay : '90',
						additional_charges : '100', 
						insurance_portion : '150', 
						total_receivable : '325',   
						total_payment: '20', 
						balance : '10',  
						comment : 'This is a second test comment.'
			})
			];  
			   
			self.checkOuts(chArray);      
	    
		
		var phoneLogList = [
		       new PhoneLog({
		       	patientId : 123, 
		       	datetime : '02/13/2013', 
		       	caller : 'Bobby smith', 
		       	attended_by : 'Marry Ann', 
		       	message : 'appointment cancellation' , 
		       	action_required : 'No', 
		       	assigned_to  : 'Nathan Abraham', 
		       	type: 'Incoming'
		       	}), 
		       	new PhoneLog({
		       	patientId : 123, 
		       	datetime : '02/19/2013',   
		       	caller : 'Bobby smith', 
		       	attended_by : 'Dan Walker', 
		       	message : 'appointment fix' ,    
		       	action_required : 'Yes', 
		       	assigned_to  : 'Ian Sinkler',     
		       	type: 'Outgoing'
		       	})
		]; 
		    
		   self.phoneLogs(phoneLogList); 
		   
		var documentList = [   
			new Document({
		       	patientId : 123, 
		       	type : 'X-ray',   
		       	DOS : '02/02/2013', 
		       	date : '02/13/2013',    
		       	is_reviewed : '' , 
		       	comment : 'No comments'
		       }),
		       new Document({
		       	patientId : 123, 
		       	type : 'Lab',   
		       	DOS : '10/02/2013', 
		       	date : '21/13/2013',    
		       	is_reviewed : '' , 
		       	comment : 'No comments either'
		       }) 
		         
		];     
		
		self.documents(documentList);       
		},   
		   	
		setFields: function(data) {
			followup(data);
		},        
		   
		setCheckOutFields: function(data) { 
			checkOut(data);                
		},             
				    
		setPhoneLogFields: function(data) { 
			phoneLog(data); 
		}, 
		
		setDocumentFields: function(data) { 
			doc(data); 
		}    
		
	};         
});