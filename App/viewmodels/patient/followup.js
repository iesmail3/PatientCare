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
	var Backend = require('modules/followup');			// Database access
	
	
	// Structures are like classses. They need to be capitalized.
	
	// Followup is one word. No need to capitalize it.
	// Followup
	// function Followup(data){ 
		// var self = this; 
		
		// if(data!= null) { 
			// //system.log(data.serviceDate);
			// self.patientId      = ko.observable(data.patient_id); 
			// self.type 			= ko.observable(data.type); 
			// self.value 	   		= ko.observable(data.value); 
			// self.unit 			= ko.observable(data.unit); 
			// self.comment 		= ko.observable(data.comment); 
			// self.plan           = ko.observable(data.plan); 
			// self.serviceDate    = ko.observable(data.service_date); 
		// }
		// else {				
			// self.patientId      = ko.observable(); 
			// self.type 			= ko.observable(); 
			// self.value 			= ko.observable(); 
			// self.unit 			= ko.observable(); 
			// self.comment 		= ko.observable();
			// self.plan           = ko.observable(); 
			// self.serviceDate    = ko.observable();  			
		// }
	// }
	
	// // CheckOut
	// function CheckOut(data) {     
		// var self = this; 
			
		// if(data != null) { 
			// self.patientId         		= ko.observable(data.patient_id);
			// self.primaryInsurance      	= ko.observable((data.primary_insurance)); 
			// self.secondaryInsurance 	= ko.observable(data.secondary_insurance); 
			// self.otherInsurance        	= ko.observable(data.other_insurance); 
			// self.date  					= ko.observable(data.date); 
			// self.copayAmount			= ko.observable(data.copay_amount); 
			// self.otherCopay				= ko.observable(data.other_copay);   
			// self.additionalCharges 		= ko.observable(data.additional_charges);   
			// self.editAdditionalCharge	= ko.observable((data.edit_additional_charge) == 'true');
			// self.insurancePortion 		= ko.observable(data.insurance_portion); 
			// self.totalReceivable       	= ko.observable(data.total_receivable); 
			// self.totalPayment          	= ko.observable(data.total_payment);    
			// self.balance   				= ko.observable(data.balance); 
			// self.comment 				= ko.observable(data.comment); 
			
			
		// }
		// else {    
			// self.patientId         		= ko.observable(); 
			// self.primaryIsurance     	= ko.observable(); 
			// self.secondaryInsurance 	= ko.observable(); 
			// self.otherInsurance        	= ko.observable(); 
			// self.date  					= ko.observable(); 
			// self.copayAmount			= ko.observable(); 
			// self.otherCopay				= ko.observable(); 
			// self.additionalCharges 		= ko.observable();
			// self.editAdditionalCharge   = ko.observable();      
			// self.insurancePortion 		= ko.observable();       
			// self.totalReceivable      	= ko.observable(); 
			// self.totalPayment          	= ko.observable();    
			// self.balance   				= ko.observable(); 
			// self.comment 				= ko.observable();
			   
		// }
	// }
	
	// //Payment Method
	// function PaymentMethod(data) { 
		// var self = this; 
		
		// if(data!= null) { 
			// self.checkOutId            = ko.observable(data.checkout_id); 
			// self.mode                  = ko.observable(data.mode); 
			// self.particulars           = ko.observable(data.particulars); 
			// self.amount                = ko.observable(data.amount); 
			// }
		// else { 
			// self.checkOutId            = ko.observable(); 
			// self.mode                  = ko.observable(); 
			// self.particulars           = ko.observable(); 
			// self.amount                = ko.observable(); 
			// }
	// }
	
	// // Prescription
	// function Prescription(data) {
		// var self = this; 
		
		// if(data!= null) { 
			// self.patientid			= ko.observable(data.patient_id); 
			// self.medicationOrderId  = ko.observable(data.medication_order_id); 
			// self.comment            = ko.observable(data.comment); 
		// }
		// else { 
			// self.patientId			= ko.observable(); 
			// self.medicationOrderId  = ko.observable();   
			// self.comment            = ko.observable(); 
		// }
	// }
	          
	// // PhoneLog  
	// function PhoneLog(data) { 
		// var self = this; 
		
		// if(data!=null) {  
			// self.patientId      = ko.observable(data.patient_id); 	
			// self.dateTime       = ko.observable(data.datetime); 
			// self.caller         = ko.observable(data.caller); 
			// self.attendedBy     = ko.observable(data.attended_by); 
			// self.message        = ko.observable(data.message); 
			// self.actionRequired = ko.observable(data.action_requried);   
			// self.assignedTo     = ko.observable(data.assigned_to); 
			// self.callType       = ko.observable(data.type); 
		// }
		// else { 
			// self.patientId      = ko.observable(); 	
			// self.dateTime       = ko.observable(); 
			// self.caller          = ko.observable(); 
			// self.attendedBy      = ko.observable(); 
			// self.message         = ko.observable(); 
			// self.actionRequired  = ko.observable(); 
			// self.assignedTo     = ko.observable(); 
			// self.callType       = ko.observable();  
		// }
	// }
	
	// // Superbill
	// function Superbill(data) { 
		// var self = this; 
		
		// if(data!=null) {
		    // self.serviceRecordId	= ko.observable(data.self_record_id); 
			// self.visitType          = ko.observable(data.visit_type); 
			// self.visitCode          = ko.observable(data.visit_code); 
			// self.levelOfService     = ko.observable(data.level_of_service); 
			// self.serviceCode        = ko.observable(data.service_code); 
			// self.isComplete         = ko.observable(data.is_complete); 			 
		// }
		// else {
		    // self.serviceRecordId    = ko.observable(); 
			// self.visitType          = ko.observable(); 
			// self.visitCode          = ko.observable(); 
			// self.levelOfService     = ko.observable(); 
			// self.serviceCode        = ko.observable(); 
			// self.isComplete         = ko.observable(); 
		// }   
	// }
	
	
	// // Misc Doc 
	// function Document(data) { 
		// var self = this; 
		
		// if(data != null) { 
		    // self.patientId     = ko.observable(data.patient_id); 
		    // self.documentType   = ko.observable(data.type);    
		    // self.DOS            = ko.observable(data.DOS); 
		    // self.receivedDate   = ko.observable(data.date);
		    // self.isReviewed     = ko.observable(data.is_reviewed);  
		    // self.comment        = ko.observable(data.comment); 
	    // }
	    // else {
		    // self.patientId     = ko.observable(); 
		    // self.documentType   = ko.observable(); 
		    // self.DOS            = ko.observable(); 
		    // self.receivedDate   = ko.observable(); 
		    // self.isReviewed     = ko.observable();  
		    // self.comment        = ko.observable(); 	    	
	    // }
			    
	// }
	
	 
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	 var backend = new Backend();
	 var followup 		= ko.observable(new backend.Followup());
	 var followups      = ko.observableArray([]); 
	 var checkOut 		= ko.observable(new backend.CheckOut()); 
	 var checkOuts      = ko.observableArray([]); 
	 var paymentMethod  = ko.observable(new backend.PaymentMethod()); 
	 var paymentMethods = ko.observableArray([]);
	 var phoneLog       = ko.observable(new backend.PhoneLog()); 
	 var phoneLogs      = ko.observableArray([]);    
	 var superBill      = ko.observable(new backend.Superbill());    
	 var prescription   = ko.observable(new backend.Prescription());
	 var doc            = ko.observable(new backend.Document());
	 var documents      = ko.observableArray([]);          
	 var patientId      = ko.observable(); 
	 var practiceId     = ko.observable(); 
	 var myArray        = ko.observableArray([]); 
	 var primaryCo      = ko.observable(); 
	 var secondaryCo    = ko.observable("23");   
	 var otherCo        = ko.observable("21");  
	 var primaryInsurance = ko.observable("500");   
	 var secondaryInsurance = ko.observable("100");
	 var otherInsurance = ko.observable("200");
	 var selectedValues = ko.observableArray([]);
	 var modes          = ko.observableArray([]); 
	   
	/*********************************************************************************************** 
	 * KO Computed Functions
	 **********************************************************************************************/
	 // var computedFunction = ko.computed(function() {});
     // system.log('priomaryCo'+ primaryCo());  
	 var copayment = ko.computed(function() {     
	 	
	 	var total = 0;   	
	     ko.utils.arrayForEach(selectedValues(), function (item) { 
            total += parseInt(item);
           
        });
	 	    
        return total;    
   });
   
  //var totalPayment = ko.computed(function)
   
   
    
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
		practiceId: practiceId, 
		myArray: myArray,
		primaryCo:primaryCo,
		secondaryCo:secondaryCo, 
		otherCo: otherCo,  
		primaryInsurance:primaryInsurance,
		secondaryInsurance:secondaryInsurance,    
		otherInsurance:otherInsurance,
		selectedValues: selectedValues,
		copayment: copayment, 
		paymentMethod: paymentMethod, 
		paymentMethods: paymentMethods,
		modes: modes,  
		/******************************************************************************************* 
		 * Methods
		 *******************************************************************************************/
		// hideButton: function() { 
			   // $('#cancelButton').show(); 
			   // $('#addButton').hide();
		// },
		
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
			
			
			$('#cancelButton').hide(); 
			$('#addButton').click(function() {
                    $('#cancelButton').show(); 
					$('#addButton').hide(); 
             });
			 
			 $('#cancelButton').click(function() {
                    $('#cancelButton').hide(); 
					$('#addButton').show(); 
             });
			// $('#secondView').on('hidden', function () {
  // $(this).removeData('modal');
// });
            
		},
		// Loads when view is loaded
		activate: function(data) {
			var self = this; 
			
			//Patient ID
			self.patientId(data.patientId); 
			
			//Pactice ID
			self.practiceId('1'); 
            
         // Add rows to the paymenyMethod table   
	    var Item = function(particulars, amount) {
        var self = this;  
        self.particulars = ko.observable(particulars); 
        self.amount = ko.observable(amount); 
        self.hasAddedRow = ko.observable(false);         
        self.addRow = function(){    
          if(!self.hasAddedRow()){
            self.hasAddedRow(true); 
            modes.push(new Item('lala',0));   
          } 
        };
    };   
    modes.push(new Item('first',0));
			
			//Module Object 
			var backend = new Backend();
			return backend.getFollowup(self.patientId(),self.practiceId()).success(function(data) {
				if(data.length > 0) {
					var s = new backend.Insurance(data[0]);
					self.followup(s);
				}
			});
			
				 
			// var temp = [
				// new Followup({
					// patientId : 123, 
					// type : '1', 
					// value : '5', 
					// unit : 'Weeks', 
					// comment : 'This is a test comment.', 
					// plan : 'testPlan', 
					// service_date : '01/02/2013'
				// }),
				// new Followup({
					// patientId : 123, 
					// type : '1', 
					// value : '6', 
					// unit : 'Days', 
					// comment : 'This is also test comment.', 
					// plan : 'testPlan2', 
					// service_date : '01/03/2013'
				// }),
				// new Followup({
					// patientId : 123, 
					// type : '2',   
					// value : '1', 
					// unit : 'Months', 
					// comment : 'This is also test comment.',       
					// plan : 'testPlan3',        
					// service_date : '01/04/2013'    
				// }),
				// new Followup({
					// patientId : 123, 
					// type : '3',   
					// value : 'None', 
					// unit : '', 
					// comment : '',       
					// plan : 'testPlan4',        
					// service_date : '02/13/2013'    
				// }),
				// new Followup({
					// patientId : 123, 
					// type : '4',   
					// value : 'None', 
					// unit : '', 
					// comment : '',       
					// plan : 'testPlan5',        
					// service_date : '02/15/2013'    
				// })
			// ]; 
			// self.followups(temp);
			
			var chArray = [
			    new CheckOut({
						patientId : 123, 
						primary_insurance : '10',   
						secondary_insurance: '20',
						other_insurance: '30',   
						date : '02/13/2013' ,
						copay_amount : '60', 
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
						primary_insurance : '5',   
						secondary_insurance: '10',
						other_insurance: '3',   
						date : '02/13/2013' ,
						copay_amount : '18',
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
			
			var paymentMethodArr = [
			new PaymentMethod({ 
			checkout_id : '12',
			mode: 'Credit',
			particulars: 'dda',
			amount: '12'
			})
			];
			
			self.paymentMethods(paymentMethodArr); 
		
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
		
		  
        var test = ['Nathan Abraham', 'Ian Sinkler'];
        self.myArray(test);
        
        return backend.getInsurance(self.patientId(),self.practiceId()).success(function(data) {
				if(data.length > 0) {
					for(var count = 0; count < data.length; count++) {
						var i = new backend.Insurance(data[count]);
						
						switch(i.insuredType()) {
	            			case 'primary':
	            				self.primaryCo(i.copayment());    
	            			  
	            				break; 
	            			case 'secondary': 
	            				self.secondaryCo(i.copayment());   
	            				system.log(i.copayment()); 
	            				break;
	            			default:   
	            				self.otherCo(i.copayment());
	            				system.log(i.copayment()); 
	            				break;
	            		}
	            	}
				}
			}); 
		   
      
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
		}, 
		
		setPaymentFields: function(data) { 
			paymentMethod(data); 
		}
		   
		
	};         
});