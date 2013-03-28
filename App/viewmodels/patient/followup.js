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
	 var Structures = require('modules/patientStructures'); 
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	 var backend = new Backend();
	 var structures = new Structures();
	 var followup 		= ko.observable(new structures.Followup());
	 var followups      = ko.observableArray([]); 
	 var checkout 		= ko.observable(new structures.Checkout()); 
	 var checkouts      = ko.observableArray([]);
     var checkoutId     = ko.observable(); 	 
	 var paymentMethod  = ko.observable(new structures.PaymentMethod()); 
	 var paymentMethods = ko.observableArray([]);
	 var phoneLog       = ko.observable(new structures.PhoneLog());
     var tempPhoneLog   = ko.observable(new structures.PhoneLog()); 	 
	 var phoneLogs      = ko.observableArray([]);    
	 var superBill      = ko.observable(new structures.Superbill());    
	 var prescription   = ko.observable(new structures.Prescription());
	 var prescriptions  = ko.observableArray([]); 
	 var doc            = ko.observable(new structures.Document());
	 var documents      = ko.observableArray([]);          
	 var patientId      = ko.observable(); 
	 var practiceId     = ko.observable(); 
	 var checkoutId     = ko.observable(); 
	 var myArray        = ko.observableArray([]); 
	 var primaryCo      = ko.observable(); 
	 var secondaryCo    = ko.observable();   
	 var otherCo        = ko.observable();  
	 var primaryInsurance = ko.observable("500");   
	 var secondaryInsurance = ko.observable("100");
	 var otherInsurance = ko.observable("200");
	 var selectedValues = ko.observableArray([]);
	 var modes          = ko.observableArray([]); 
	 var phoneLogState  = ko.observable(true); 
	 var phoneLogAdd    = ko.observable(); 
	 var phoneLogSave   = ko.observable(); 
	 var phoneLogCancel = ko.observable(); 
	 var showAssigned   = ko.observable(true);  
	 var id             = ko.observable();
     var primaryCheck   = ko.observable(false); 
     var secondaryCheck = ko.observable(false); 
	 var otherCheck     = ko.observable(false);	 
	 
	/*********************************************************************************************** 
	 * KO Computed Functions
	 **********************************************************************************************/  
	 var copayment = ko.computed(function() { 
       var total =0; 
		if(primaryCheck() == true)	 
			total += parseInt(primaryCo()); 
		if(secondaryCheck() == true)
			total+= parseInt(secondaryCo());
		if(otherCheck() == true)
			total+= parseInt(otherCo());
			
		 return total; 
   	}); 
   
   	 var totalPay = ko.computed(function() {     
		var total = 0;
			 for(var i = 0; i < paymentMethods().length; i++) {
			    total += parseInt(paymentMethods()[i].amount());
			 }	
		return total;    
    });

     var totalReceivable = ko.computed(function() {     
		var total = 0;
		total+= copayment();
		if(checkout().additionalCharges() > 0) {
			total += parseInt(checkout().additionalCharges());
		}
		if(checkout().otherCopay() > 0)
			 total +=parseInt(checkout().otherCopay());
		return total; 
    });    
   
   var balance = ko.computed(function() {     
		var difference = 0;
			difference = totalReceivable() - totalPay();
		if(isNaN(difference))
		  return '0';
		else
		  return difference;
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
			structures: structures,
			followup: followup,
			followups: followups,  
			checkout: checkout,
			checkouts: checkouts, 
			phoneLog: phoneLog,
			phoneLogs: phoneLogs, 
			tempPhoneLog: tempPhoneLog, 
			superBill: superBill, 
			prescription: prescription,
			prescriptions: prescriptions,
			doc: doc,   
			documents: documents,   
			patientId: patientId,
			practiceId: practiceId, 
			checkoutId: checkoutId,
			myArray: myArray,
			primaryCo:primaryCo,
			secondaryCo:secondaryCo, 
			otherCo: otherCo,  
			primaryInsurance:primaryInsurance,
			secondaryInsurance:secondaryInsurance,    
			otherInsurance:otherInsurance,
			selectedValues: selectedValues,
			paymentMethod: paymentMethod, 
			paymentMethods: paymentMethods,
			modes: modes,  
			phoneLogState: phoneLogState, 
			phoneLogAdd: phoneLogAdd, 
			phoneLogSave: phoneLogSave,
			phoneLogCancel: phoneLogCancel,
			showAssigned: showAssigned,
			id: id,
			primaryCheck: primaryCheck,
			secondaryCheck: secondaryCheck,
			otherCheck: otherCheck,
			checkoutId: checkoutId,
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
				
				checkout().editAdditionalCharge.subscribe(function(newValue) {
					if (!newValue)
					checkout().additionalCharges("0");
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
			// var Item = function(particulars, amount) {
			    // system.log('inside item'); 
				// var self = this;  
				// self.particulars = ko.observable(particulars); 
				// self.amount = ko.observable(amount); 
				// self.hasAddedRow = ko.observable(false);         
				// self.addRow = function(){    
				  	// system.log('inside add row'); 
				  // if(!self.hasAddedRow()){
					// self.hasAddedRow(true); 
				
					// paymentMethods.push(new Item('lala',0));   
				  // } 
				// };
			// };   
			//paymentMethods.push(new Item('first',0));
			 
			backend.getFollowup(self.patientId(),self.practiceId()).success(function(data) { 
				if(data.length > 0) {
				var f = $.map(data, function(item) {return new structures.Followup(item) });
					self.followups(f);
                    self.followup(f[0]); 					
				}				
			});
	         
            backend.getCheckOut(self.patientId(),self.practiceId()).success(function(data) { 
				if(data.length > 0) {
				    var ch = $.map(data, function(item) {return new structures.Checkout(item) });
					self.checkouts(ch); 
					self.checkout(ch[0]);  					
				} 
			});
			
			backend.getPhoneLog(self.patientId(),self.practiceId()).success(function(data) { 
				if(data.length > 0) {
					 var p = $.map(data, function(item) {return new structures.PhoneLog(item) });
					 self.phoneLogs(p);
					 self.phoneLog(p[0]); 
					
				} 
			});
			
			backend.getDocument(self.patientId(),self.practiceId()).success(function(data) { 
				if(data.length > 0) {
					 var d = $.map(data, function(item) {return new structures.Document(item) });
					 self.documents(d);
                     self.doc(d[0]); 					 
				} 
			});
							
			backend.getPrescription(self.patientId(),self.practiceId()).success(function(data) { 
				if(data.length > 0) {
					 var p = $.map(data, function(item) {return new structures.Prescription(item) });
					 self.prescriptions(p);
                     self.prescription(p[0]); 					 
				} 
			});
			
			backend.getPaymentMethods(checkout().id()).success(function(data) {	
			  system.log('checkoutid' + checkout().id());  
				if(data.length > 0) {
				    var p = $.map(data, function(item) {return new structures.PaymentMethod(item) });
					paymentMethods(p);
                    paymentMethod(p[0]); 					
				} 
			});
		   
			var test = ['Nathan Abraham', 'Ian Sinkler'];
			self.myArray(test);
			
			backend.getInsurance(self.patientId(),self.practiceId()).success(function(data) {      		
				if(data.length > 0) {
					for(var count = 0; count < data.length; count++) {
						var i = new structures.Insurance(data[count]);
						
						switch(i.type()) {
							case 'primary': 	self.primaryCo(i.copayment());
							                    self.primaryCheck(true); 
                                                break; 
							case 'secondary': 	self.secondaryCo(i.copayment());
												self.secondaryCheck(true);
                                                break;
							default:   			self.otherCo(i.copayment());
												self.otherCheck(true);
                                                break;
						}
					}
				}
			}); 
		},       
		copayment: copayment, 
		totalPay:  totalPay,
		balance:   balance,
		totalReceivable: totalReceivable,
		setFields: function(data) {
			followup(data);
		},        
	
		setCheckOutFields: function(data) {  
			checkout(data); 
			//checkoutId(data.id()); 
			backend.getPaymentMethods(data.id()).success(function(data) {	
				if(data.length > 0) {
				    var p = $.map(data, function(item) {return new structures.PaymentMethod(item) });
					paymentMethods(p);
                    paymentMethod(p[0]); 					
				} 
			});  
            			
		},                
		setPhoneLogFields: function(data) { 
			phoneLog(data);
			
		}, 
		setDocumentFields: function(data) { 
			doc(data); 
		}, 
		setPaymentFields: function(data) { 
			paymentMethod(data); 
		},
		setPrescriptionFields: function(data) { 
			prescription(data); 
		},
		phoneLogCancel: function() {
			phoneLogState(true);
			phoneLog(tempPhoneLog());
			showAssigned(true);  
		},
		 phoneLogAdd: function() { 
				phoneLogState(false);
			   tempPhoneLog(phoneLog());
               phoneLog(new structures.PhoneLog());
			   showAssigned(false); 
		} 
	};         
});