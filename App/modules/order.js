/**************************************************************************************************
 * Module name: Patient
 * Author(s): Sean malone
 * Description: This module is used to query the database.
 *************************************************************************************************/
define(function(require) {
	/*********************************************************************************************** 
	 * Includes*
	 **********************************************************************************************/
	var system = require('durandal/system');			// System logger
	
	/**********************************************************************************************
	 * Constructor
	 *********************************************************************************************/
	var order = function() {};
	
	/**********************************************************************************************
	 * Get Methods
	 * 
	 * These methods retrieve information from the database via SELECT queries
	 *********************************************************************************************/
	// Get Patient ID
	// Get All Patients
	order.prototype.getPatientId = function() {
		return this.query({
			mode: 'select', 
			table: 'order', 
			fields: 'id',
			order: 'ORDER BY id DESC',
			limit: 'LIMIT 1'
		});
	}
	
	// Get All Patients
	order.prototype.getPatients = function() {
		return this.query({
			mode: 'select', 
			table: 'order', 
			fields: '*'
		});
	}
	
	// Get Personal Information for a Single Patient
	order.prototype.getPatient = function(id, practiceId) {
		return this.query({
			mode: 'select', 
			table: 'patient', 
			fields: '*', 
			where: "WHERE id='" + id + "' AND practice_id='" + practiceId + "'"
		});
	}
	
	// Get Patient information from ServiceRecord
	order.prototype.getPatientFromService = function(id) {
		var fields = [
			'patient.id', 'patient.practice_id', 'patient.physician_id', 'id_number', 'id_type',
			'first_name', 'middle_name', 'last_name', 'address', 'city', 'state', 'zip', 'province',
			'country', 'phone', 'phone_ext', 'mobile', 'date_of_birth', 'alias', 'gender'
		];
		return this.query({
			mode: 'select',
			table: 'service_record',
			fields: fields,
			join: "LEFT JOIN patient ON service_record.patient_id=patient.id",
			where: "WHERE service_record.id='" + id + "'"
		})
	}
	
	// Get Vital Signs
	order.prototype.getVitals = function(id) {
		return this.query({
			mode: 'select',
			table: 'vital_signs',
			fields: '*',
			where: "WHERE service_record_id='" + id + "'" 
		});
	}
	
	order.prototype.getServiceRecord = function(patientId, practiceId, date) {
		return this.query({
			mode: 'select',
			table: 'service_record',
			fields: '*',
			where: "WHERE patient_id='" + patientId + "' AND practice_id='" 
			+ practiceId + "' AND date='" + date + "'"
		});
	}
	
	// Get Diagnostic Centers
	order.prototype.getCenters = function(id) {
		return this.query({
			mode: 'select',
			table: 'diagnostic_center',
			fields: '*',
			where: "WHERE practice_id='" + id + "'"
		});
	}
	
	order.prototype.getOrderTypes = function(id, type) {
		return this.query({
			mode: 'select',
			table: 'order_category',
			fields: '*',
			where: "WHERE practice_id='" + id + "' AND type='" + type + "'"
		});
	}
	
	order.prototype.getOrder = function(id) {
		return this.query({
			mode: 'select',
			table: 'orders',
			fields: '*',
			where: "WHERE id='" + id + "'"
		});
	}
	
	order.prototype.getOrders = function(id) {
		var fields = ['orders.id', 'orders.service_record_id', 'orders.in_office', 'orders.instructions', 
			'orders.assigned_to', 'orders.date', 'orders.order_category_id', 'order_category.description',
			'orders.type', 'orders.comment', 'orders.center', 'orders.group'
		];
		return this.query({
			mode: 'select',
			table: 'orders',
			fields: 'orders.id, orders.service_record_id, orders.in_office, orders.instructions,' + 
					'orders.assigned_to, orders.date, orders.order_category_id, order_category.description,' +
					'orders.type, orders.comment, orders.center, orders.group',
			join: "LEFT JOIN order_category ON orders.order_category_id=order_category.id",
			where: "WHERE service_record_id='" + id + "'"
		});
	}
	
	order.prototype.getOrderGroup = function(id) {
		return this.query({
			mode: 'select',
			table: 'orders',
			fields: '`group`',
			where: "WHERE service_record_id='" + id + "'",
			order: "ORDER BY `group` DESC",
			limit: "LIMIT 1"
		});
	}
	
	order.prototype.getOfficeProcedureTypes = function(id) {
		return this.query({
			mode: 'select',
			table: 'office_procedure_type',
			fields: '*',
			where: "WHERE practice_id='" + id + "'"
		});
	}
	
	order.prototype.getOfficeProcedures = function(id) {
		return this.query({
			mode: 'select',
			table: 'office_procedure',
			fields: '*',
			where: "WHERE order_id='" + id + "'"
		});
	}
	
	order.prototype.getSupplyTypes = function(id) {
		return this.query({
			mode: 'select',
			table: 'supply_type',
			fields: '*',
			where: "WHERE practice_id='" + id + "'"
		});
	}
	
	order.prototype.getSupplies = function(id) {
		return this.query({
			mode: 'select',
			table: 'supplies',
			fields: '*',
			where: "WHERE order_id='" + id + "'"
		});
	}
		
	order.prototype.getMedicines = function() {
		return this.query({
			mode: 'select',
			fields: 'medicine_name',
			table: 'medicine_list',
		});
	}
	
	order.prototype.getDiluents = function() {
		return this.query({
			mode: 'select',
			fields: 'diluent',
			table: 'diluent_list',
		});
	}
	
	order.prototype.getDrugOrders = function(id) {
		return this.query({
			mode: 'select',
			fields: '*',
			table: 'drug_order',
			where: "WHERE order_id='" + id + "'"
		});
	}			
		
	/**********************************************************************************************
	 * Save Methods
	 * 
	 * These methods add information to the database via INSERT and UPDATE queries
	 *********************************************************************************************/
	// Add Personal Information for a Single Patient
	order.prototype.savePatient = function(id, data) {
		var self = this;
		var fields = ['practice_id', 'id', 'first_name', 'middle_name', 'last_name', 'alias', 
			'date_of_birth', 'id_number', 'id_type', 'physician_id', 'address', 'city', 'state',
			'zip', 'province', 'country', 'phone', 'phone_ext', 'mobile', 'gender', 'marital_status',
			'family_history_type','family_history_comment', 'routine_exam_comment', 'insurance_type',
			'record_status', 'contact_name', 'contact_phone', 'contact_mobile', 'contact_relationship',
			'insurance_name', 'email'];
		
		var values = $.map(data, function(k,v) {
			if(v != 'lastFirstName' && v!= 'insuredType')
				if(k() == null || k() == undefined) {
					return [''];
				}
				else
					return [k()];
		});

		var newId = '';
		if(id == 'new') {
			return self.query({
				mode: 'select',
				table: 'order',
				fields: 'id',
				order: 'ORDER BY id DESC',
				limit: 'LIMIT 1'
			}).success(function(data) {
				$.each(data, function(key, item) {
					newId = parseInt(item.id) + 1;
				});
				
				values[1] = newId;
				
				self.query({
					mode: 'insert', 
					table: 'order',
					fields: fields, 
					values: values
				});
			});
		}
		else {
			return self.query({
				mode: 'update', 
				table: '`order`',
				fields: fields, 
				values: values, 
				where: "WHERE id='" + id + "' AND practice_id='" + practiceId + "'"
			});
		}
	}
	
	order.prototype.saveServiceRecord = function(id, data) {
		var self = this;
		
		var fields = ['id', 'practice_id', 'order_id', 'physician_id', 'date', 'reason', 'history',
			'systems_comment', 'no_known_allergies', 'allergies_verified', 'physical_examination_comment',
			'plan_and_instructions'];
		
		var values = $.map(data, function(k,v) {
			if(k() == null || k() == undefined) {
				return [''];
			}
			else
				return [k()];
		});
		
		return self.query({
			mode: 'update',
			table: 'service_record',
			fields: fields,
			values: values,
			where: "Where id='" + id + "'"
		});
	}
	
	order.prototype.saveOrder = function(data, method) {
		var self = this;
		var fields = ['id', 'service_record_id', 'order_category_id',
			'type', 'in_office', 'instructions', 'assigned_to', 'date',
			'comment', 'center', 'group'];
		var values = $.map(data, function(k,v) {
			if(v == 'description') 
				return null;
			if(k() == null || k() == undefined) {
				return [''];
			}
			else
				return [k()];
		});
		
		if(method == "update") {
			self.query({
				mode: 'update',
				table: 'orders',
				fields: fields,
				values: values,
				where: "Where `group`='" + data.group() + "' AND `order_category_id`='" 
				+ data.orderCategoryId() + "'"
			});
		}
		else {
			self.query({
				mode: 'insert', 
				table: 'orders',
				fields: fields, 
				values: values
			});
		}
	}
	
	order.prototype.saveOfficeProcedure = function(data, method) {
		var self = this;
		var fields = ['id', 'order_id', 'office_procedure_type_id', 'times'];
		var values = $.map(data, function(k,v) {
			if(v == 'description') 
				return null;
			if(k() == null || k() == undefined) {
				return [''];
			}
			else
				return [k()];
		});
		
		if(method == "update") {
			self.query({
				mode: 'update',
				table: 'office_procedure',
				fields: fields,
				values: values,
				where: "Where `order_id`='" + data.orderId() + "' AND `office_procedure_type_id`='" 
				+ data.officeProcedureTypeId() + "'"
			});
		}
		else {
			self.query({
				mode: 'insert', 
				table: 'office_procedure',
				fields: fields, 
				values: values
			});
		}
	}
	
	order.prototype.saveSupply = function(data, method) {
		var self = this;
		var fields = ['id', 'order_id', 'supply_type_id', 'quantity'];
		var values = $.map(data, function(k,v) {
			if(v == 'description') 
				return null;
			if(k() == null || k() == undefined) {
				return [''];
			}
			else
				return [k()];
		});
		
		if(method == "update") {
			self.query({
				mode: 'update',
				table: 'supplies',
				fields: fields,
				values: values,
				where: "Where `order_id`='" + data.orderId() + "' AND `supply_type_id`='" 
				+ data.supplyTypeId() + "'"
			});
		}
		else {
			self.query({
				mode: 'insert', 
				table: 'supplies',
				fields: fields, 
				values: values
			});
		}
	}
	
	order.prototype.saveDrugOrder = function(order, orders) {
		var self = this;
		var fields = ['id', 'order_id', 'scr', 'crcl', 'medicine', 'dose', 'basis', 
					  'prescribed_dose', 'route', 'diluent', 'volume', 'duration', 
					  'seq', 'days', 'instructions', 'calculated_dose'];
		var values = $.map(order, function(k, v) {
			if(k() == null || k() == undefined)
				return [''];
			else
				return [k()];
		});

		
		if(values[0] != "") {
			return self.query({
				mode: 'update',
				table: 'drug_order',
				fields: fields,
				values: values,
				where: "WHERE id='" + order.id() + "'"
			});	
		}
		else {
			return self.query({
				mode: 'select',
				table: 'drug_order',
				fields: 'id',
				where: "WHERE order_id='" + order.orderId() + "'",
				order: "ORDER BY id DESC",
				LIMIT: "LIMIT 1" 
			}).success(function(data) {
				var id = data[0].id;
				order.id(id);
				return self.query({
					mode: 'insert',
					table: 'drug_order',
					fields: fields,
					values: values
				});
			});
		}
		
	}
	
	/**********************************************************************************************
	 * Delete Methods
	 * 
	 * These methods remove information from the database via DELETE queries
	 *********************************************************************************************/
	// Delete Personal Information for a Single Patient
	order.prototype.deletePatient = function(id) {
		return this.query({
			mode: 'delete', 
			table: 'order', 
			where: "WHERE id='" + id + "'"
		});
	}
	
	// Delete Service Record for a Single Patient
	order.prototype.deleteServiceRecord = function(id) {
		return this.query({
			mode: 'delete', 
			table: 'service_record', 
			where: "WHERE id='" + id + "'"
		});
	}
	
	// Delete Order
	order.prototype.deleteOrder = function(id, group) {
		return this.query({
			mode: 'delete',
			table: 'orders',
			where: "WHERE order_category_id='" + id + "' AND `group`='" + group + "'"
		});
	}
	
	// Delete Office Procedure
	order.prototype.deleteOfficeProcedure = function(data) {
		return this.query({
			mode: 'delete',
			table: 'office_procedure',
			where: "WHERE order_id='" + data.orderId() + "' AND office_procedure_type_id='" + data.officeProcedureTypeId() + "'"
		});
	}
	
	// Delete Supplies
	order.prototype.deleteSupply = function(data) {
		return this.query({
			mode: 'delete',
			table: 'supplies',
			where: "WHERE order_id='" + data.orderId() + "' AND supply_type_id='" + data.supplyTypeId() + "'"
		});
	}
	
	// Delete Drug Order
	order.prototype.deleteDrugOrder = function(id) {
		return this.query({
			mode: 'delete',
			table: 'drug_order',
			where: "WHERE id='" + id + "'"
		});
	}
	
	/**********************************************************************************************
	 * Query
	 * 
	 * This method is used by all other methods to execute the ajax call.
	 *********************************************************************************************/ 
	order.prototype.query = function(data) {
		return $.getJSON('php/query.php',data);
	}
	
	/**************************************************************************************************
	 * Return class so it is usable.
	 *************************************************************************************************/
	return order;
});