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
	 var phoneLogState  = ko.observable(false); 
	 var phoneLogAdd    = ko.observable(); 
	 var phoneLogSave   = ko.observable(); 
	 var phoneLogCancel = ko.observable(); 
	/*********************************************************************************************** 
	 * KO Computed Functions
	 **********************************************************************************************/  
	 var copayment = ko.computed(function() {     
	 	
	 	var total = 0;   	
	     ko.utils.arrayForEach(selectedValues(), function (item) { 
            total += parseInt(item);
           
        });
	 	    
        return total;    
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
		phoneLogState: phoneLogState, 
		phoneLogAdd: phoneLogAdd, 
		phoneLogSave: phoneLogSave,
		phoneLogCancel: phoneLogCancel, 
		/******************************************************************************************* 
		 * Methods
		 *******************************************************************************************/
		 phoneLogAdd: function() {
				phoneLogState(true);
			},
			
			phoneLogCancel: function() {
				phoneLogState(false);
			},
		
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
			//var backend = new Backend();
			return backend.getFollowup(self.patientId(),self.practiceId()).success(function(data) {
				system.log('inside followup length is' + data.length); 
				if(data.length > 0) {
					var s = new backend.Followup(data[0]);
					//self.followup(s);
					self.followups(self.followup(s)); 
					system.log('inside followup loop length is' + data.length);
				}
				system.log('followups is' + followups); 
			});
	         
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
	            				break;
	            			default:   
	            				self.otherCo(i.copayment()); 
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