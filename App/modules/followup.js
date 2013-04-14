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
		var fields = ['medication_order.id,medicine_list.medicine_name','medication_order.quantity',
					  'medication_order.sigs','medication_order.strength','medication_order.dispensed_quantity',
					  'medication_order.refill_quantity,medication_order.is_added','medication_order.prescribed_by',
					  'medication_order.created_by','medication_order.date','medication_order.comment','medication_order.refill','medication_order.route',
					  'medication_order.order']; 
			return this.query({
				mode: 'select',
				table:'medication_order',
				join: "JOIN medicine_list ON medication_order.medicine_list_id=medicine_list.id",
				fields:fields
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
	
	followup.prototype.getDocumentByType = function(patientId,type) {
		if(type.trim() == 'All') { 
			return this.query({
				mode: 'select',
				table: 'document',
				fields: '*',
				where: "WHERE patient_id='" + patientId + "'"
			});
		} 
		else { 
		
			return this.query({
				mode: 'select',
				table: 'document',
				fields: '*',
				where: "WHERE type='" + type + "' AND patient_id='" + patientId + "'"
			});
		}
	}
	followup.prototype.getPrescription = function() {
		return this.query({
			mode: 'select',
			table: 'prescription',
			fields: '*'
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
	
	followup.prototype.getMedicationOrder = function(id) { 
		return this.query({
			mode: 'select',
			table: 'medication_order',
			fields: '*',
			where: "WHERE id='" + id + "'"
		});
	}
	
	followup.prototype.getDiagnosis = function() { 
		return this.query({
			mode: 'select',
			table: 'diagnosis',
			fields: '*'
		});
	}
	

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
	
	// Update a single followup 
	followup.prototype.saveDiagnosis = function(id, data) {
		var self = this;   
		var fields = ['id','service_record_id','diagnosis','code'];

		var values = $.map(data, function(k,v) {
			return [k];
		});
		
		return self.query({
				mode:  'update', 
				table: 'diagnosis',
				fields: fields, 
				values: values, 
				where: "WHERE id='" + id + "'"
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
	

	followup.prototype.savePrescription = function(data,date,comment,mode) {
		var self = this; 
		var fields = ['medicine','strength','quantity','route','sigs','order','dispensed_quantity','refill'
		,'refill_quantity','physician','created_by','date','mode','comment','medication_order_id'];
		var values = $.map(data, function(k,v) {
			if(k == null || k == undefined) {
				return[''];
			}
			else {
				return [k()];
			}	
		});
		$.each(data, function(k, v) {
		  values[0] = data.medicineName(); 
		  values[1] = data.strength();
          values[2] = data.quantity();  
          values[3] = data.route(); 
		  values[4] = data.sigs(); 
		  values[5] = data.order(); 
		  values[6] = data.dispensedQuantity(); 
		  values[7] = data.refill(); 
		  values[8] = data.refillQuantity();
		  values[9] = data.prescribedBy();
		  values[10] = data.createdBy();
		  values[11] = date;
		  values[12] = mode ;
		  values[13] = comment ;
		  values[14] = data.id(); 
		 }); 
		   
		 // for(var i =0; i < fields.length; i++) 
		   // system.log(fields[i] + ':' + values[i]); 
		return self.query({
				mode:  'insert', 
				table: 'prescription',
				fields: fields,  
				values: values,
		});	
	}
	
	followup.prototype.saveDocument = function(doc,documents,practiceId,patientId) {
		var self = this;
		// Convert true/false to 1/0
		doc.isReviewed(doc.isReviewed() ? 1 : 0);

		var fields = ['id', 'patient_id','practice_id','service_record_id', 'location', 'type', 'date', 'comment', 
					  'is_reviewed', 'is_report', 'date_of_service'];
		var values = $.map(doc, function(k, v) {
			if(k() == null || k() == undefined)
				return [''];
			else
				return [k()];
		});
		
        values[1] = patientId();
		values[2] = practiceId();  
		values[6] = form.dbDate(doc.date());
		values[10] = form.dbDate(doc.dateOfService());
		
		for(var i = 0; i < fields.length; i++) 
		    system.log(fields[i] + ' : ' + values[i]); 
		
		if(values[0] != "") {
			return self.query({
				mode: 'update',
				table: 'document',
				fields: fields,
				values: values,
				where: "WHERE id='" + doc.id() + "'"
			});	
		}
	
		else {
			return self.query({
				mode: 'select',
				table: 'document',
				fields: 'id',
				where: "WHERE id='" + doc.id() + "'",
				order: "ORDER BY id DESC",
				LIMIT: "LIMIT 1" 
			}).success(function(data) {
				var id = 1;
				if(data.length > 0)
					var id = data[0].id;
				doc.id(id);
				return self.query({
					mode: 'insert',
					table: 'document',
					fields: fields,
					values: values
				});
				
				documents.push(doc());
			});
		}
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
	
	// Delete diagnosis
	followup.prototype.deleteDiagnosis = function(id) { 
		return this.query({
			mode: 'delete', 
			table: 'diagnosis', 
			where: "WHERE id='" + id() + "'"
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
	
	followup.prototype.deletePrescription = function(id) {
		system.log('ready to delete id' + id); 
		return this.query({
			mode:'delete',
			table:'prescription',
			where:"WHERE medication_order_id='" + id + "'"
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
	
	
	
	
	
	
	
	