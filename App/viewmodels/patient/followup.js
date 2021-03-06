/***************************************************************************************************
 * ViewModel: Followup.js
 * Author(s): Imran Esmail 
 * Description: Handles the business logic for the Followup section of the patient
 *              record. This includes the Followup, checkout, phonelog,prescription, and document tabs.
 **************************************************************************************************/
define(function(require) { 
	/*********************************************************************************************** 
	 * Includes*
	 **********************************************************************************************/
	 var system = require('durandal/system');			// System logger
	 var Custom = require('durandal/customBindings');	// Custom bindings
	 var Backend = require('modules/followup');			// Database access
	 var Forms = require('modules/form');					// Common form elements
	 var Structures = require('modules/patientStructures'); 
	 var modal	   = require('modals/modals');				// Modals
	 var app = require('durandal/app');
	 var UserStructures	= require('modules/structures');		// User structures
	 
	/*********************************************************************************************** 
	/* KO Observables
	 **********************************************************************************************/
	 var form 			= new Forms();
	 var backend 		= new Backend();
	 var structures 	= new Structures();
	 var userStructures  = new UserStructures();
	 var role			= ko.observable(new userStructures.Role());
	 var followup 		= ko.observable(new structures.Followup());
	 var followups      = ko.observableArray([]); 
	 var checkout 		= ko.observable(new structures.Checkout()); 
	 var checkouts      = ko.observableArray([]);
     var checkoutId     = ko.observable(); 	 
	 var paymentMethod  = ko.observable(new structures.PaymentMethod()); 
	 var paymentMethods = ko.observableArray([new structures.PaymentMethod()]);
	 var phoneLog       = ko.observable(new structures.PhoneLog());
     var tempPhoneLog   = ko.observable(new structures.PhoneLog()); 
	 var tempDocument   = ko.observable(new structures.Document()); 
	 var phoneLogs      = ko.observableArray([]);    
	 var superBill      = ko.observable(new structures.Superbill());    
	 var superBills     = ko.observableArray([]); 
	 var prescription   = ko.observable(new structures.Prescription());
	 var prescriptions  = ko.observableArray([]); 
	 var doc            = ko.observable(new structures.Document());
	 var documents      = ko.observableArray([]); 
	 var medicationOrder= ko.observable(new structures.Medication());
	 var patientId      = ko.observable(); 
	 var practiceId     = ko.observable(); 
	 var checkoutId     = ko.observable(); 
	 var myArray        = ko.observableArray([]); 
	 var primaryCo      = ko.observable(); 
	 var secondaryCo    = ko.observable();   
	 var otherCo        = ko.observable();  
	 var selectedValues = ko.observableArray([]);
	 var modes          = ko.observableArray([]); 
	 var phoneLogState  = ko.observable(true); 
	 var phoneLogAdd    = ko.observable(); 
	 var phoneLogSave   = ko.observable(); 
	 var phoneLogCancel = ko.observable(); 
	 var documentState  = ko.observable(true); 
	 var documentAdd    = ko.observable(); 
	 var documentSave   = ko.observable(); 
	 var documentCancel = ko.observable(); 
	 var showAssigned   = ko.observable(true);  
	 var id             = ko.observable();
     var primaryCheck   = ko.observable(false); 
     var secondaryCheck = ko.observable(false); 
	 var otherCheck     = ko.observable(false);	 
	 var physicianName  = ko.observable(); 
	 var groupOrders 	= ko.observableArray([]);
	 var file 			= ko.observable(); 
	 var documentType   = ko.observable("Document Type");
	 var isNewDocument  = ko.observable(false); 
	 
	/*********************************************************************************************** 
	 * KO Computed Functions
	 **********************************************************************************************/  
	 var copayment = ko.computed(function() { 
       var total =0;  
		if(checkout().primaryInsurance())	 
			total += parseInt(primaryCo()); 
		if(checkout().secondaryInsurance())
			total+= parseInt(secondaryCo());
		if(checkout().otherInsurance())
			total+= parseInt(otherCo());
		checkout().copayAmount(total); 
		 return total; 
   	}); 
    // Total Pay - Get the total payment due
   	 var totalPay = ko.computed(function() {      
		var total = 0;
			for(var i = 0; i < paymentMethods().length; i++) {
				var p = paymentMethods()[i];
				if(!isNaN(parseInt(p.amount()))){
					total += parseInt(p.amount());
					}
			}
		checkout().totalPayment(total); 
		return total;    
    });
	// Total Receivable - Get the total receivable due
     var totalReceivable = ko.computed(function() {     
		var total = 0;
		total+= copayment();
		if(checkout().additionalCharges() > 0) {
			total += parseInt(checkout().additionalCharges());
		}
		if(checkout().otherCopay() > 0)
			 total +=parseInt(checkout().otherCopay());
		if(checkout().insurancePortion() > 0) 
			total +=parseInt(checkout().insurancePortion()); 
		checkout().totalReceivable(total); 
		return total; 
    });    
   // Balane - Get the balance due
   var balance = ko.computed(function() {     
		var difference = 0;
			difference = totalReceivable() - totalPay();
		if(isNaN(difference)){
		  checkout().balance('0'); 
		  return '0';
		}
		else{
		  checkout().balance(difference); 
		  return difference;
		}
    });
   
	/*********************************************************************************************** 
	 * ViewModel
	 *  
	 * For including ko observables and computed functions, add an attribute of the same name.
	 * Ex: observable: observable
	 **********************************************************************************************/
	return{
		/******************************************************************************************* 
		 * Attributes
		 *******************************************************************************************/
		structures: structures,
		role: role,
		followup: followup,
		followups: followups,  
		checkout: checkout,
		checkouts: checkouts, 
		phoneLog: phoneLog,
		phoneLogs: phoneLogs, 
		tempPhoneLog: tempPhoneLog,
		tempDocument: tempDocument, 
		superBill: superBill,
		superBills: superBills,
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
		selectedValues: selectedValues,
		paymentMethod: paymentMethod, 
		paymentMethods: paymentMethods,
		modes: modes,  
		phoneLogState: phoneLogState, 
		phoneLogAdd: phoneLogAdd, 
		phoneLogSave: phoneLogSave,
		phoneLogCancel: phoneLogCancel,
		documentState: documentState, 
		documentAdd: documentAdd, 
		documentSave: documentSave, 
		documentCancel: documentCancel, 
		showAssigned: showAssigned,
		id: id,
		primaryCheck: primaryCheck,
		secondaryCheck: secondaryCheck,
		otherCheck: otherCheck,
		checkoutId: checkoutId,
		physicianName: physicianName,
		form: form,
		medicationOrder: medicationOrder,
		file: file,
		documentType: documentType,
		isNewDocument: isNewDocument,
		
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
			
			$( ".currentDate" ).datepicker({dateFormat:"mm/dd/yy"}).datepicker("setDate",new Date());
			
			$('.outerPane').height(parseInt($('.contentPane').height()) - 62);
			$('.formScroll').height(parseInt($('.tab-pane').height()) - 62);
			$(window).resize(function() {
				$('.outerPane').height(parseInt($('.contentPane').height()) - 62);
				$('.formScroll').height(parseInt($('.tab-pane').height()) - 62);
			});
		},
		// Loads when view is loaded
		activate: function(data) {
			backend.getRole(global.userId, global.practiceId).success(function(data) {
					self.role(new userStructures.Role(data[0]));
				});
			var self = this;  
			//Patient ID
			self.patientId(data.patientId); 
			//Practice ID
			self.practiceId(global.practiceId);	// Comes from app.php in Scripts section
			// Get Followup list for a patient
			backend.getFollowup(self.patientId(),self.practiceId()).success(function(data) { 
				if(data.length > 0) {
					var f = $.map(data, function(item) {
					item.service_date = form.uiDate(item.service_date)
					return new structures.Followup(item)}); 
						self.followups(f);
						self.followup(f[0]);
				}				
			});
            // Get Checkout list for a patient 
            backend.getCheckOut(self.patientId(),self.practiceId()).success(function(data) {  				
				if(data.length > 0) {
					checkoutId(data[0].id); 
				    var ch = $.map(data, function(item) {return new structures.Checkout(item) });
					self.checkouts(ch); 
					self.checkout(ch[0]);  					
				} 
			    // Get Payment Methods 
				backend.getPaymentMethods(self.checkoutId()).success(function(data) {	 
					if(data.length > 0) {
						var p = $.map(data, function(item) {return new structures.PaymentMethod(item) });
						self.paymentMethods(p);
						self.paymentMethod(p[0]);
						self.paymentMethods.push(new structures.PaymentMethod()); 
						
					}
					else { 
						self.paymentMethods.push(new structures.PaymentMethod()); 
				    }
				}); 
			});
			//Get PhoneLog list for a single patient
			backend.getPhoneLog(self.patientId(),self.practiceId()).success(function(data) {
				if(data.length > 0) {
					
					 var p = $.map(data, function(item) {
					 item.datetime = form.uiDate(item.datetime)
					 return new structures.PhoneLog(item) });
					
					 self.phoneLogs(p);
					 self.phoneLog(p[0]); 
				} 
			}); 
			//Get Superbill list for a single patient 
			backend.getSuperBill(self.patientId()).success(function(data) { 
				if(data.length > 0) { 
					 var p = $.map(data, function(item) {
					 item.date = form.uiDate(item.date)
					 return new structures.Superbill(item) }); 
					 self.superBills(p);
					 self.superBill(p[0]); 
				} 
			});
			// Get Document list for a single patient 
			backend.getDocument(self.patientId(),self.practiceId()).success(function(data) { 
				if(data.length > 0) {
					 var d = $.map(data, function(item) { 
					  item.date = form.uiDate(item.date)
					  item.date_of_service = form.uiDate(item.date_of_service)
					 return new structures.Document(item) }); 
					 self.documents(d);
                     self.doc(d[0]); 					 
				} 
			});
			//Get prescription list for a single patient 
			backend.getPrescription(self.patientId(),self.practiceId()).success(function(data) { 
				if(data.length > 0) {
					 var p = $.map(data, function(item) {
					  item.date = form.uiDate(item.date)
					 return new structures.Prescription(item) });
					 self.prescriptions(p);
                     self.prescription(p[0]); 					 
				} 
			});
			//Get physician for a specified practice id
			backend.getPhysician(self.practiceId()).success(function(data) {
				if(data.length > 0) {
					var p = $.map(data, function(item) { return item.first_name + " " + item.last_name }); 
					self.myArray(p); 
				} 
			}); 
			//Get Insurance for a single patient and set it to the appropriate insurance observables
			return backend.getInsurance(self.patientId(),self.practiceId()).success(function(data) {      		
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
		//Set the Followup tab fields
		setFields: function(data) {
			followup(data);
		},        
		// Set Checkout tab fields 
		setCheckOutFields: function(data) { 
			checkout(data);  
			backend.getPaymentMethods(data.id()).success(function(data) {		
				if(data.length > 0) {
				    var p = $.map(data, function(item) {return new structures.PaymentMethod(item) });
					paymentMethods(p);
	                paymentMethod(p[0]); 	
					paymentMethods.push(new structures.PaymentMethod()); 	
				} 
				else { 
				      paymentMethods.removeAll();
					  paymentMethods.push(new structures.PaymentMethod()); 
				}
			});    			
		},        
		//Set Phonelog tab fields 
		setPhoneLogFields: function(data) { 
			phoneLog(data);
			
		}, 
		//Set document tab fields
		setDocumentFields: function(data) { 
		    isNewDocument(false); 
			doc(data);
		}, 
		//Set the Presction tab fields
		setPrescriptionFields: function(data) { 
			prescription(data); 
		},
		// Sets the temp bservable to the current observable
		phoneLogCancel: function() {
			phoneLogState(true);
			phoneLog(tempPhoneLog());
			showAssigned(true);  
		},
		// Sets the current observable to the temp observable and sets the current observable to null
		phoneLogAdd: function() { 
			   phoneLogState(false);
			   tempPhoneLog(phoneLog());
	           phoneLog(new structures.PhoneLog());
			   showAssigned(false); 
		},
		//Sets the temp document to the currnet document
		documentCancel: function() {
		    isNewDocument(false); 
			documentState(true);
			doc(tempDocument()); 
		},
		//Adds a new document to the table
		documentAdd: function() { 
			   documentState(false);
			   isNewDocument(true); 
			   tempDocument(doc());
	          doc(new structures.Document());
		},
		//Show prescription modal 
		selectRow: function(data) {
			// Clear group
			groupOrders([]);
			//Repopulate the group
			$.each(prescriptions(), function(k, v) {
					groupOrders.push(v.medicationOrderId());
			});
			//Show prescription modal 
			modal.showPrescription(medicationOrder,prescriptions,groupOrders, patientId, practiceId, 'Prescription Details');
		},
		//show additional detaisl modal 
		selectLink: function(data) {
			modal.showAdditionalDetails('Additional Details');
		},
		//show superbill modal 
		selectSuperbill: function(data) {
			modal.showSuperbill(superBill,role,'Superbill');
		},
		//show diaply file modal 
		displayFile: function(data) { 
			doc(data); 
			modal.showFile(doc().location(),'Selected File'); 
		},
		//Saves the followup record
		saveFollowup: function(data) {
			if(followup().errors().length > 0) {
				if(followup().errors().length > 1) {
					$('.followup .allAlert').fadeIn().delay(3000).fadeOut();
				}
				else if(followup().errors()[0] == 'value') {
					$('.followup .valueAlert').fadeIn().delay(3000).fadeOut();
				}
				else if(followup().errors()[0] == 'unit') {
					$('.followup .unitAlert').fadeIn().delay(3000).fadeOut();
				}
			}
		    else {
		   
				backend.saveFollowup(followup().id(), followup());
			    $('.followup .followupAlert').fadeIn().delay(3000).fadeOut();
			}
		},
		//Deletes a followup 
		deleteFollowup: function(item, test) {
			return app.showMessage(
				'Are you sure you want to delete followup with service date ' + item.serviceDate() +'?', 
				'Delete', 
				['Yes', 'No'])
			.done(function(answer){
				if(answer == 'Yes') {
					backend.deleteFollowup(item.id()).complete(function(data) {
						if(data.responseText == 'fail') {
							app.showMessage('The followup could not be deleted.', 'Deletion Error');
						}
						else
							followups.remove(item);
					});
				}
			});
		},
		//Adds a new row to the payment method table
		addRow: function(data) {  
			var last = paymentMethods()[paymentMethods().length - 1];
			if(last.mode().trim()!='') 
			   paymentMethods.push(new structures.PaymentMethod()); 
		},
		//Deletes a row from a payment method table
		removePaymentMethod: function(data) {
			paymentMethods.remove(data); 
			backend.deletePaymentMethod(data.id()); 
		},
		//Deletes prescription from prescription table
		deletePrescription: function(data) {
			 var prescription = data;
			 prescriptions.remove(prescription);
			 backend.deletePrescription(data.medicationOrderId());
		},
		//Saves payment method
		savePaymentMethod: function(data) { 
		    backend.saveCheckout(checkout()); 
			//Check to see if  you have any rows in the payment method table
			if(paymentMethods().length  > 0) { 
				var isValid = true;
				var pm = paymentMethods()[paymentMethods().length-1]; 
				//remove last row if these two are empty
				if(pm.particulars().trim() == '' && pm.amount().trim() == '') {
					paymentMethods.remove(pm);
				}
				//check to see if there are any remaining rows after removing the last one
				if(paymentMethods().length > 0) { 
					$.each(paymentMethods(), function(k, v) {
					
						if(v.errors().length > 1) {
								isValid = false; 
								$('.checkout .allAlert').fadeIn().delay(3000).fadeOut();
						}
						else if(v.errors()[0] == 'mode') {
								isValid = false; 
								$('.checkout .modeAlert').fadeIn().delay(3000).fadeOut();
						}
						else if(v.errors()[0] == 'amount') {
								 isValid = false; 
								$('.checkout .amountAlert').fadeIn().delay(3000).fadeOut();
						}
					}); 
					
					if(isValid) {
						$('.checkoutAlert').fadeIn('slow').delay(2000).fadeOut('slow');
						$.each(paymentMethods(), function(k, v) {
						  backend.savePaymentMethod(checkout().id(),v);
						}); 
					}
				
					paymentMethods.push(new structures.PaymentMethod());
                }					
		    }
		},
		//Saves phonelog record 
		savePhoneLog: function(data) {
			if(phoneLog().errors().length > 0) {
				if(phoneLog().errors().length > 1) {
					$('.phoneLog .allAlert').fadeIn().delay(3000).fadeOut();
				}
				else if(phoneLog().errors()[0] == 'datetime') {
					$('.phoneLog .dateAlert').fadeIn().delay(3000).fadeOut();
				}
				else if(phoneLog().errors()[0] == 'caller') {
					$('.phoneLog .callerAlert').fadeIn().delay(3000).fadeOut();
				}
				else if(phoneLog().errors()[0] == 'attendedBy') {
					$('.phoneLog .attendedByAlert').fadeIn().delay(3000).fadeOut();
				}
				else if(phoneLog().errors()[0] == 'type') {
					$('.phoneLog .typeAlert').fadeIn().delay(3000).fadeOut();
				}
				else if(phoneLog().errors()[0] == 'actionRequired') {
					$('.phoneLog .actionRequiredAlert').fadeIn().delay(3000).fadeOut();
				}
			}
			else { 
				 $('.phoneLog .phoneLogAlert').fadeIn().delay(3000).fadeOut();
				 backend.savePhoneLog(phoneLog,phoneLogs,practiceId(),patientId(),showAssigned); 
			}
		},
		//Saves document record 
		saveDocument: function(data) {
			if(doc().errors().length > 0) { 
				if(doc().errors().length > 1) {
					$('.document .allAlert').fadeIn().delay(3000).fadeOut();
				}
				else if(doc().errors()[0] == 'type') {
					$('.document .typeAlert').fadeIn().delay(3000).fadeOut();
				}
			}
			else {
				if(doc().id() == null) {
					doc().location(file());  
				}
				 isNewDocument(false);
				  backend.saveDocument(doc(),documents,practiceId,patientId); 
				 $('.fileupload').fineUploader('uploadStoredFiles'); 
				  $('.document .documentAlert').fadeIn().delay(3000).fadeOut();
				  documentState(true);
				  doc(new structures.Document());
				
			}					
		},
		//Searches document record by specified type 
		searchByType: function(data) { 
			backend.getDocumentByType(patientId(),practiceId(),documentType()).success(function(data) { 
				if(data.length > 0) {  
					 var d = $.map(data, function(item) {
					 item.date = form.uiDate(item.date)
					 item.date_of_service = form.uiDate(item.date_of_service)
					 return new structures.Document(item) });
						documents(d);
						doc(d[0]); 
				}
				else {
						documents(new structures.Document());
						doc(new structures.Document());
				}
			}); 
			
	    },
		//Displays prescription pdf file
		clickPrint: function(data) { 
				if(prescriptions().length != 0) {
					var height = $('.flowHolder').height();
					var settings = 'directories=no, height=' + height + ', width=800, location=yes, ' +
						   'menubar=no, status=no, titlebar=no, toolbar=no';
					var win = window.open(
						'php/printPrescription.php/?practiceId=' + 
						practiceId() + '&patientId=' + patientId() +
						 '&medicationOrderId=' + prescription().medicationOrderId(),					
						'',
						settings
					);
				}
				else { 
							return app.showMessage(
					'There is currently no prescription to print', 
					'Prescription', 
					['Ok']);
			   }
			    
		},
		//Displays checkout pdf file
		printCheckout: function(data) { 
			if(checkouts().length != 0) {
				var height = $('.flowHolder').height();
				var settings = 'directories=no, height=' + height + ', width=800, location=yes, ' +
						   'menubar=no, status=no, titlebar=no, toolbar=no';
				var win = window.open(
						'php/printCheckout.php/?practiceId=' + practiceId() + 
						'&patientId=' + checkout().patientId()+ '&serviceRecordId=' 
						+ checkout().serviceRecordId() + '&checkoutId=' + checkout().id() + 
						'&primaryCo=' + primaryCo() + '&secondaryCo=' + secondaryCo() 
						+'&otherCo=' + otherCo(),					
						'',
						settings
					);
			}
			else { 
					return app.showMessage(
					'There is currently no checkout to print', 
					'Checkout', 
					['Ok']);
			}
		},
		//Displays checkout order pdf file 
		printCheckoutOrder: function(data) {  
			if(checkouts().length != 0) {
				var height = $('.flowHolder').height();
				var settings = 'directories=no, height=' + height + ', width=800, location=yes, ' +
						   'menubar=no, status=no, titlebar=no, toolbar=no';
				var win = window.open(
						'php/printCheckoutOrder.php/?practiceId=' + practiceId() + 
						'&patientId=' + checkout().patientId() + '&serviceRecordId=' 
						+ checkout().serviceRecordId() + '&checkoutId=' 
						+ checkout().id()
						,					
						'',
						settings
					);
		    }
			else { 
					return app.showMessage(
					'There is currently no checkout order to print', 
					'Checkout Order', 
					['Ok']);
			}
		}
		
    };//End ViewModel
});//End file 