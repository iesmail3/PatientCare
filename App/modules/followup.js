/**************************************************************************************************
 * Module name: Followup
 * Author(s): Imran Esmail 
 * Description: This module is used to query the database.
 *************************************************************************************************/
 define(function(require) {
	/*********************************************************************************************** 
	 * Includes*
	 **********************************************************************************************/
	var system = require('durandal/system');			// System logger
	var Forms = require('modules/form');					// Common form elements
	var form = new Forms(); 
	/**********************************************************************************************
	 * Constructor
	 *********************************************************************************************/
	var followup = function() {};
	/**********************************************************************************************
	 * Get Methods
	 * 
	 * These methods retrieve information from the database via SELECT queries
	 *********************************************************************************************/
	
	 // Get Personal Information for a Single Patient
	followup.prototype.getFollowup = function(patientId, practiceId) {
		return this.query({
			mode: 'select',
			table: 'follow_up',
			fields: '*',
			where: "WHERE patient_id='" + patientId + "' AND practice_id='" + practiceId + "'"
		});
	} 
	
	followup.prototype.getPhysician = function(practiceId) {  
		return this.query({
			mode: 'select',
			table: 'physician',
			fields: '*',
			where: "WHERE practice_id='" + practiceId + "'"
		});
	}
	
	followup.prototype.getSuperBill = function() {
	var fields = ['service_record.date','service_record.physical_examination_comment','superbill.is_complete']; 
		return this.query({
			mode: 'select',
			table: 'service_record',
			join: "JOIN superbill ON service_record.id=superbill.service_record_id",
			fields: fields
		});
	}
	
	 //Get PrescriptionDetails 
	 followup.prototype.getPrescriptionDetails = function() { 
		var fields = ['medicine_list.medicine_name','medication_order.quantity','medication_order.sigs',
					  'medication_order.strength','medication_order.dispensed_quantity',
					  'medication_order.refill_quantity']; 
			return this.query({
				mode: 'select',
				table:'medication_order',
				join: "JOIN medicine_list ON medication_order.medicine_list_id=medicine_list.id",
				fields:'*'
		});
	 }
	
	followup.prototype.getCheckOut = function(id, practiceId) {
		return this.query({
			mode: 'select',
			table: 'checkout',
			fields: '*',
			where: "WHERE patient_id='" + id + "' AND practice_id='" + practiceId + "'"
		});
	}
	
	followup.prototype.getPaymentMethods = function(id) { 
		return this.query({
			mode: 'select',
			table: 'payment_method',
			fields: '*',
			where: "WHERE checkout_id='" + id + "'"
		});
	}
	
	followup.prototype.getPhoneLog = function(id, practiceId) {
		return this.query({
			mode: 'select',
			table: 'phone_log',
			fields: '*',
			where: "WHERE patient_id='" + id + "' AND practice_id='" + practiceId + "'"
			
		});
		 
	}
	
	followup.prototype.getLastPhoneLog = function() { 
		return this.query({
			mode: 'select',
			table: 'phone_log',
			fields: 'id',
			order: 'ORDER BY id DESC',
			limit: 'LIMIT 1'
		}); 
	}
	
	followup.prototype.getDocument = function(id, practiceId) {
		return this.query({
			mode: 'select',
			table: 'document',
			fields: '*',
			where: "WHERE patient_id='" + id + "' AND practice_id='" + practiceId + "'"
		});
	}
	
	followup.prototype.getPrescription = function(id, practiceId) {
		return this.query({
			mode: 'select',
			table: 'prescription',
			fields: '*',
			where: "WHERE patient_id='" + id + "' AND practice_id='" + practiceId + "'"
		});
	}
	
	// Get All Insurances for a Single Patient
	followup.prototype.getInsurance = function(id,practiceId) {
		return this.query({
			mode: 'select', 
			table: 'insurance', 
			fields: '*', 
			where: "WHERE patient_id='" + id + "' AND practice_id='" + practiceId + "'"
		});
	}
	
	// followup.prototype.getPhysician = function(data) { 
		// var fields = ['physician.first_name','physician.last_name']; 
		// return self.query({
			// mode: 'select',
			// table: 'service-record',
			// join: "JOIN physician ON service_record.physician_id=physician.id",
			// fields: fields,
			// where: "WHERE service_record.date='" + data.date() + "'"
		// });
	// }
	/**********************************************************************************************
	 * Save Methods
	 * 
	 * These methods save information to the database via INSERT and UPDATE queries
	 *********************************************************************************************/
	// Update a single followup 
	followup.prototype.saveFollowup = function(id, data) {
		var self = this; 
		var patientId = data.patientId();  
		var fields = ['id','patient_id','service_record_id','type','value','unit','comment','service_date','plan'];

		var values = $.map(data, function(k,v) {
			return [k];
		});
		
		return self.query({
				mode:  'update', 
				table: 'follow_up',
				fields: fields, 
				values: values, 
				where: "WHERE id='" + id + "' AND patient_id='" + patientId + "'"
			});
	}
	
	followup.prototype.savePaymentMethod = function(checkoutId, paymentMethod) { 
		var self = this; 
		var fields = ['id','checkout_id','mode','particulars','amount'];
		var values = $.map(paymentMethod, function(k,v) {
			if(k == null || k == undefined) {
				return[''];
			}
			else {
				return [k()];
			}
		});
         values[1] = checkoutId;
		 
		if(paymentMethod.id() == undefined || paymentMethod.id() == '') { 
			
			 
		    var newId = '';
			return self.query({
					mode: 'select',
					table: 'payment_method',
					fields: 'id',
					order: 'ORDER BY id DESC',
					limit: 'LIMIT 1'
			}).success(function(data) {
					$.each(data, function(key, item) {
							newId = parseInt(item.id) + 1;
					});
					
					values[0] = newId;
					paymentMethod.id(newId); 
					self.query({
							mode: 'insert',
							table: 'payment_method',
							fields: fields,
							values: values,
					});
			});
		}
		else { 
			return self.query({
				mode:  'update', 
				table: 'payment_method',
				fields: fields, 
				values: values,
				where: "WHERE id='" + paymentMethod.id() + "'"
			});	
		}  
	}
	
	followup.prototype.savePhoneLog = function(phoneLog,phoneLogs,practiceId,patientId,showAssigned) { 
	        system.log('inside query it is' + showAssigned()); 
			var self = this; 
			var fields = ['id','patient_id','practice_id','datetime','caller','attended_by','message','action_required','assigned_to','type'];
			var values = $.map(phoneLog(), function(k,v) {
					if(k == null || k == undefined) {
							return[''];
					}
					else {
							return [k()];
					}
			});
			values[1] = patientId;
			values[2] = practiceId;  
			values[3] = form.dbDate(phoneLog().datetime()); 
			if(phoneLog().id() == undefined || phoneLog().id() == '') {
             showAssigned(true); 
			 system.log('inside new'); 			
			   var newId = '';
			return self.query({
					mode: 'select',
					table: 'phone_log',
					fields: 'id',
					order: 'ORDER BY id DESC',
					limit: 'LIMIT 1'
			}).success(function(data) {
					$.each(data, function(key, item) {
							newId = parseInt(item.id) + 1;
					});
					
					values[0] = newId;
					phoneLog().id(newId); 
					self.query({
							mode: 'insert',
							table: 'phone_log',
							fields: fields,
							values: values,
					});
					
					phoneLogs.push(phoneLog()); 
			   });
		}
			
		   
			else { 
			   system.log('inside update');
					return self.query({
							mode:  'update', 
							table: 'phone_log',
							fields: fields, 
							values: values,
							where: "WHERE id='" + phoneLog().id() + "'"
					});        
			}  
    }
	
	
		
	followup.prototype.saveCheckout = function(data) {  
		var self = this; 
		var fields = ['id','practice_id','patient_id','date','copay_amount',
			'other_copay','additional_charges','edit_additional_charge','insurance_portion',
			'total_receivable','total_payment','balance','comment','primary_insurance',
			'secondary_insurance','other_insurance'];
		
		// Convert true/false back to 1/0
		data.editAdditionalCharge(data.editAdditionalCharge() ? 1 : 0);
		data.primaryInsurance(data.primaryInsurance() ? 1 : 0);
		data.secondaryInsurance(data.secondaryInsurance() ? 1 : 0);
		data.otherInsurance(data.otherInsurance() ? 1 : 0);
		 
		var values = $.map(data, function(k,v) {
			if(k == null || k == undefined) {
				return[''];
			}
			else {
				return [k()];
			}
		});
		
		return self.query({
			mode:  'update', 
			table: 'checkout',
			fields: fields, 
			values: values,
			where: "WHERE id='" + data.id() + "'"
		});
	}	
	/**********************************************************************************************
	 * Delete Methods
	 * 
	 * These methods remove information from the database via DELETE queries
	 *********************************************************************************************/
	 // Delete followup
	followup.prototype.deleteFollowup = function(id) { 
		return this.query({
			mode: 'delete', 
			table: 'follow_up', 
			where: "WHERE id='" + id + "'"
		});
	}
	
	 // Delete Payment Method 
	followup.prototype.deletePaymentMethod = function(id) {
		return this.query({
			mode: 'delete', 
			table: 'payment_method', 
			where: "WHERE id='" + id + "'"
		});
	}
			
	// /**********************************************************************************************
	 // * Query
	 // * 
	 // * This method is used by all other methods to execute the ajax call.
	 // *********************************************************************************************/ 
	followup.prototype.query = function(data) {
		return $.getJSON('php/query.php',data);
	}
	
	// /**************************************************************************************************
	 // * Return class so it is usable.
	 // *************************************************************************************************/
	 return followup;
});
	
	
	
	
	
	
	
	