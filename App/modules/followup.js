/**************************************************************************************************
 * Module name: Followup
 * Author(s): Imran Esmail 
 * Description: This module is used to query the database. It queries the database for followup
				,checkout,phonelog,prescription, and document tabs. 
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
	// Role
	followup.prototype.getRole = function(id, practiceId) {
		return this.query({
			mode: 'select', 
			table: 'user', 
			fields: '*',
			join: "JOIN role ON user.role_id=role.id",
			where: "WHERE user.id='" + id +"' AND user.practice_id='" + practiceId + "'"
		});
	}
	 // Get Personal Information for a Single Patient
	followup.prototype.getFollowup = function(patientId, practiceId) {
		return this.query({
			mode: 'select',
			table: 'follow_up',
			fields: '*',
			where: "WHERE patient_id='" + patientId + "' AND practice_id='" + practiceId + "'"
		});
	} 
	
	// Get physician name based on practice id
	followup.prototype.getPhysician = function(practiceId) {  
		return this.query({
			mode: 'select',
			table: 'physician',
			fields: '*',
			where: "WHERE practice_id='" + practiceId + "'"
		});
	}
	
	//Get service record 
	followup.prototype.getSuperBill = function(patientId) {
	var fields = ['service_record.date','service_record.physical_examination_comment','superbill.is_complete']; 
		return this.query({
			mode: 'select',
			table: 'service_record',
			join: "JOIN superbill ON service_record.id=superbill.service_record_id AND service_record.practice_id = superbill.practice_id AND service_record.patient_id='"+patientId +"'",
			fields: fields
		});
	}
	
	 //Get PrescriptionDetails 
	 followup.prototype.getPrescriptionDetails = function() { 
		var fields = ['medication.id,medicine_list.medicine_name','medication.quantity',
					  'medication.sigs','medication.strength','medication.dispensed_quantity',
					  'medication.refill_quantity,medication.is_added','medication.prescribed_by',
					  'medication.created_by','medication.date','medication.comment','medication.refill','medication.route',
					  'medication.order']; 
			return this.query({
				mode: 'select',
				table:'medication',
				join: "JOIN medicine_list ON medication.medicine_list_id=medicine_list.id",
				fields:fields
		});
	 }
	
	// Get checkout information for a single patient 
	followup.prototype.getCheckOut = function(id, practiceId) {
		return this.query({
			mode: 'select',
			table: 'checkout',
			fields: '*',
			where: "WHERE patient_id='" + id + "' AND practice_id='" + practiceId + "'"
		});
	}
	
	// Get payment methods for a single patient 
	followup.prototype.getPaymentMethods = function(id) { 
		return this.query({
			mode: 'select',
			table: 'payment_method',
			fields: '*',
			where: "WHERE checkout_id='" + id + "'"
		});
	}
	
	// Get phoneLog for a single patient 
	followup.prototype.getPhoneLog = function(id, practiceId) {
		return this.query({
			mode: 'select',
			table: 'phone_log',
			fields: '*',
			where: "WHERE patient_id='" + id + "' AND practice_id='" + practiceId + "'"
			
		});
		 
	}
	//Get the last phoneLog
	followup.prototype.getLastPhoneLog = function() { 
		return this.query({
			mode: 'select',
			table: 'phone_log',
			fields: 'id',
			order: 'ORDER BY id DESC',
			limit: 'LIMIT 1'
		}); 
	}
	
	// Get documents for a single patient 
	followup.prototype.getDocument = function(id, practiceId) {
		return this.query({
			mode: 'select',
			table: 'document',
			fields: '*',
			where: "WHERE patient_id='" + id + "' AND practice_id='" + practiceId + "'"
		});
	}
	// Get document based on document type 
	followup.prototype.getDocumentByType = function(patientId,practiceId,type) {
		if(type.trim() == 'All') { 
			return this.query({
				mode: 'select',
				table: 'document',
				fields: '*',
				where: "WHERE patient_id='" + patientId + "' AND practice_id='" + practiceId + "'"
			});
		} 
		else { 
		
			return this.query({
				mode: 'select',
				table: 'document',
				fields: '*',
				where: "WHERE type='" + type + "' AND patient_id='" + patientId + "' AND practice_id='" + practiceId + "'"
			});
		}
	}
	//Get prescriptions 
	followup.prototype.getPrescription = function(patientId,practiceId) {
		return this.query({
			mode: 'select',
			table: 'prescription',
			fields: '*',
			where: "WHERE patient_id='" + patientId + "' AND practice_id='" + practiceId + "'"
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
	//Get MedicationOrder for a single patient
	followup.prototype.getMedicationOrder = function(id) { 
		return this.query({
			mode: 'select',
			table: 'medication',
			fields: '*',
			where: "WHERE id='" + id + "'"
		});
	}
	//Get Diagnosis for a single patient
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
		var practiceId = data.practiceId();  
		var fields = ['id','patient_id','practice_id','service_record_id','type','value','unit','comment','service_date','plan'];

		var values = $.map(data, function(k,v) {
			return [k];
		});
		values[8] = form.dbDate(data.serviceDate()); 
		return self.query({
				mode:  'update', 
				table: 'follow_up',
				fields: fields, 
				values: values, 
				where: "WHERE id='" + id + "' AND patient_id='" + patientId + "' AND practice_id='" + practiceId + "'"
			});
	}
	// Update a single diagnosis
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
	// Save payment methods for a single patient 
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
			// select the last record's id from the table,increment it by one, and set it
			// equal to the new record's id 
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
	// Save phoneLog for a single patient 
	followup.prototype.savePhoneLog = function(phoneLog,phoneLogs,practiceId,patientId,showAssigned) { 
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
			// Insert new record 
			if(phoneLog().id() == undefined || phoneLog().id() == '') {
             showAssigned(true);  			
			   var newId = 1;
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
			return self.query({
					mode:  'update', 
					table: 'phone_log',
					fields: fields, 
					values: values,
					where: "WHERE id='" + phoneLog().id() + "'"
			});        
		}  
    }
    //Save checkout for a single patient 
	followup.prototype.saveCheckout = function(data) {  
		var self = this; 
		var fields = ['id','practice_id','patient_id','service_record_id',
		'date','copay_amount','other_copay','additional_charges','edit_additional_charge',
		'insurance_portion','total_receivable','total_payment','balance','comment',
		'primary_insurance','secondary_insurance','other_insurance'];
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
    // Save a prescription for a single patient 
	followup.prototype.savePrescription = function(data,date,comment,mode) { 
		var self = this; 
		var fields = ['medicine','strength','quantity','route','sigs',
		'order','dispensed_quantity','refill'
		,'refill_quantity','physician','created_by','date','mode',
		'comment','medication_id,patient_id,practice_id'];
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
		  values[15] = data.patientId(); 
		  values[16] = data.practiceId(); 
		 }); 
		 
		return self.query({
				mode:  'insert', 
				table: 'prescription',
				fields: fields,  
				values: values,
		});	
	}
	
	// Save documents for a single patient 
	followup.prototype.saveDocument = function(doc,documents,practiceId,patientId) {
		var self = this;
		// Convert true/false to 1/0
		doc.isReviewed(doc.isReviewed() ? 1 : 0);
        
		var fields = ['id', 'patient_id','practice_id','service_record_id',
		'location', 'type', 'date', 'comment', 'is_reviewed','is_report','date_of_service'];
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
		
		if(values[0] != "") { 
			self.query({
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
				order: "ORDER BY id DESC",
				LIMIT: "LIMIT 1" 
			}).success(function(data) {
				var newId = 1; 
				if(data.length > 0)
					newId = parseInt(data[0].id) + 1; 
				values[6] = form.currentDate(); 
				values[0] = newId;
				doc.id(newId);
				doc.date(form.currentDate()); 
				
				 self.query({
					mode: 'insert',
					table: 'document',
					fields: fields,
					values: values
				});
				
				documents.push(doc);
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
	
	// Delete Payment Method 
	followup.prototype.deletePaymentMethod = function(id) {
		return this.query({
			mode: 'delete', 
			table: 'payment_method', 
			where: "WHERE id='" + id + "'"
		});
	}
	
	// Delete prescriptions
	followup.prototype.deletePrescription = function(id) {
		return this.query({
			mode:'delete',
			table:'prescription',
			where:"WHERE medication_id='" + id + "'"
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
	
	
	
	
	
	
	
	