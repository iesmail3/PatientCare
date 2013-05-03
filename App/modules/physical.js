/**************************************************************************************************
 * Module name: Physical Examinations
 * Viewmodel: App/viewmodels/patient/servicerecord/physical.js
 * Author(s): Gary Chang
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
	var physical = function() {};
	
	/**********************************************************************************************
	 * Get Methods
	 * 
	 * These methods retrieve information from the database via SELECT queries
	 *********************************************************************************************/
	// Role
	physical.prototype.getRole = function(id, practiceId) {
		return this.query({
			mode: 'select', 
			table: 'user', 
			fields: '*',
			join: "JOIN role ON user.role_id=role.id",
			where: "WHERE user.id='" + id +"' AND user.practice_id='" + practiceId + "'"
		});
	}
	
	// Get Service Records for a Single Patient
	physical.prototype.getServiceRecord = function(patientId, practiceId, date) {
		return this.query({
			mode: 'select',
			table: 'service_record',
			fields: '*',
			where: "WHERE patient_id='" + patientId + "' AND practice_id='" + practiceId + "' AND date='" + date + "'"
		});
	}
	
	// Get Medical Problems for a Single Service Record
	physical.prototype.getVitalSigns = function(serviceRecordId) {
		return this.query({
			mode: 'select',
			table: 'vital_signs',
			fields: '*',
			where: "WHERE service_record_id='" + serviceRecordId + "'"
		});
	}
	
	// Get ABD
	physical.prototype.getPeAbd = function(serviceRecordId) {
		return this.query({
			mode: 'select',
			table: 'pe_abd',
			fields: '*',
			where: "WHERE service_record_id='" + serviceRecordId + "'"
		});
	}
	
	// Get CVS
	physical.prototype.getPeCvs = function(serviceRecordId) {
		return this.query({
			mode: 'select',
			table: 'pe_cvs',
			fields: '*',
			where: "WHERE service_record_id='" + serviceRecordId + "'"
		});
	}
	
	// Get CW
	physical.prototype.getPeCw = function(serviceRecordId) {
		return this.query({
			mode: 'select',
			table: 'pe_cw',
			fields: '*',
			where: "WHERE service_record_id='" + serviceRecordId + "'"
		});
	}
	
	// Get ENT
	physical.prototype.getPeEnt = function(serviceRecordId) {
		return this.query({
			mode: 'select',
			table: 'pe_ent',
			fields: '*',
			where: "WHERE service_record_id='" + serviceRecordId + "'"
		});
	}
	
	// Get EXT
	physical.prototype.getPeExt = function(serviceRecordId) {
		return this.query({
			mode: 'select',
			table: 'pe_ext',
			fields: '*',
			where: "WHERE service_record_id='" + serviceRecordId + "'"
		});
	}
	
	// Get EYE
	physical.prototype.getPeEye = function(serviceRecordId) {
		return this.query({
			mode: 'select',
			table: 'pe_eye',
			fields: '*',
			where: "WHERE service_record_id='" + serviceRecordId + "'"
		});
	}
	
	// Get GEN
	physical.prototype.getPeGen = function(serviceRecordId) {
		return this.query({
			mode: 'select',
			table: 'pe_gen',
			fields: '*',
			where: "WHERE service_record_id='" + serviceRecordId + "'"
		});
	}
	
	// Get HEME
	physical.prototype.getPeHeme = function(serviceRecordId) {
		return this.query({
			mode: 'select',
			table: 'pe_heme',
			fields: '*',
			where: "WHERE service_record_id='" + serviceRecordId + "'"
		});
	}
	
	// Get LUNGS
	physical.prototype.getPeLungs = function(serviceRecordId) {
		return this.query({
			mode: 'select',
			table: 'pe_lungs',
			fields: '*',
			where: "WHERE service_record_id='" + serviceRecordId + "'"
		});
	}
	
	// Get NEURO
	physical.prototype.getPeNeuro = function(serviceRecordId) {
		return this.query({
			mode: 'select',
			table: 'pe_neuro',
			fields: '*',
			where: "WHERE service_record_id='" + serviceRecordId + "'"
		});
	}
	
	// Get SKIN
	physical.prototype.getPeSkin = function(serviceRecordId) {
		return this.query({
			mode: 'select',
			table: 'pe_skin',
			fields: '*',
			where: "WHERE service_record_id='" + serviceRecordId + "'"
		});
	}
	
	/**********************************************************************************************
	 * Save Methods
	 * 
	 * These methods add information to the database via INSERT and UPDATE queries
	 *********************************************************************************************/
	// Save Service Record
	physical.prototype.saveServiceRecord = function(patientId, practiceId, date, serviceRecord) {
		var self = this;
		var fields = ['id', 'practice_id', 'patient_id', 'physician_id', 'date', 'reason', 'history',
			'systems_comment', 'no_known_allergies', 'allergies_verified', 'physical_examination_comment',
			'plan_and_instructions'];
		
		var values = $.map(serviceRecord, function(k,v) {
			if(k() == null || k() == undefined) {
				return [''];
			}
			else {
				return [k()];
			}
		});
		
		return self.query({
			mode: 'update',
			table: 'service_record',
			fields: fields,
			values: values,
			where: "WHERE patient_id='" + patientId + "' AND practice_id='" + practiceId + "' AND date='" + date + "'"
		});
	}
	
	// Save Vital Signs
	physical.prototype.saveVitalSigns = function(vitalSigns, type) {
		var self = this;
		var fields = ['service_record_id', 'height', 'height_type', 'weight', 'weight_type', 'temp',
			'temp_type', 'hc', 'resp', 'spo2', 'sitting_blood_pressure', 'sitting_pulse', 'lying_blood_pressure',
			'lying_pulse', 'standing_blood_pressure', 'standing_pulse', 'comment'];
		
		var values = $.map(vitalSigns, function(k,v) {
			if(k() == null || k() == undefined) {
				return [''];
			}
			else {
				return [k()];
			}
		});
		
		if (type == 'update') {
			return self.query({
				mode: 'update',
				table: 'vital_signs',
				fields: fields,
				values: values,
				where: "WHERE service_record_id='" + vitalSigns.serviceRecordId() + "'"
			});
		}
		
		else if (type == 'insert') {
			return self.query({
				mode: 'insert',
				table: 'vital_signs',
				fields: fields,
				values: values
			});
		}
	}
	
	// Save ABD
	physical.prototype.savePeAbd = function(peAbd) {
		var self = this;
		var fields = ['id', 'service_record_id', 'type', 'inspection', 'palpation', 'percussion',
			'auscultation', 'comment'];
		
		var values = $.map(peAbd, function(k,v) {
			if (k() == null || k() == undefined) {
				return [''];
			}
			else {
				return [k()];
			}
		});
		
		if (peAbd.id() == undefined || peAbd.id() == '') {
			return self.query({
				mode: 'select',
				table: 'pe_abd',
				fields: 'id',
				order: 'ORDER BY id DESC',
				limit: 'LIMIT 1'
			}).success(function(data) {
				var newId = 1;
				if (data.length > 0)
					newId = parseInt(data[0].id) + 1;
				
				values[0] = newId;
				peAbd.id(newId);
				self.query({
					mode: 'insert',
					table: 'pe_abd',
					fields: fields,
					values: values
				});
			});
		}
		else {
			return self.query({
				mode: 'update',
				table: 'pe_abd',
				fields: fields,
				values: values,
				where: "WHERE id='" + peAbd.id() + "'"
			});
		}
	}

	// Save CVS
	physical.prototype.savePeCvs = function(peCvs) {
		var self = this;
		var fields = ['id', 'service_record_id', 'type', 'rhythm', 'murmur', 'gallop', 'rub', 'comment'];
		var values = $.map(peCvs, function(k,v) {
			if (k() == null || k() == undefined) {
				return [''];
			}
			else {
				return [k()];
			}
		});
		
		if (peCvs.id() == undefined || peCvs.id() == '') {
			return self.query({
				mode: 'select',
				table: 'pe_cvs',
				fields: 'id',
				order: 'ORDER BY id DESC',
				limit: 'LIMIT 1'
			}).success(function(data) {
				var newId = 1;
				if (data.length > 0)
					newId = parseInt(data[0].id) + 1;
				
				values[0] = newId;
				peCvs.id(newId);
				self.query({
					mode: 'insert',
					table: 'pe_cvs',
					fields: fields,
					values: values
				});
			});
		}
		else {
			return self.query({
				mode: 'update',
				table: 'pe_cvs',
				fields: fields,
				values: values,
				where: "WHERE id='" + peCvs.id() + "'"
			});
		}
	}

	// Save CW
	physical.prototype.savePeCw = function(peCw) {
		var self = this;
		var fields = ['id', 'service_record_id', 'type', 'asymmetry', 'chest', 'scar', 'comment'];
		var values = $.map(peCw, function(k,v) {
			if (k() == null || k() == undefined) {
				return [''];
			}
			else {
				return [k()];
			}
		});
		
		if (peCw.id() == undefined || peCw.id() == '') {
			return self.query({
				mode: 'select',
				table: 'pe_cw',
				fields: 'id',
				order: 'ORDER BY id DESC',
				limit: 'LIMIT 1'
			}).success(function(data) {
				var newId = 1;
				if (data.length > 0)
					newId = parseInt(data[0].id) + 1;
				
				values[0] = newId;
				peCw.id(newId);
				self.query({
					mode: 'insert',
					table: 'pe_cw',
					fields: fields,
					values: values
				});
			});
		}
		else {
			return self.query({
				mode: 'update',
				table: 'pe_cw',
				fields: fields,
				values: values,
				where: "WHERE id='" + peCw.id() + "'"
			});
		}
	}

	// Save ENT
	physical.prototype.savePeEnt = function(peEnt) {
		var self = this;
		var fields = ['id', 'service_record_id', 'type', 'oral_lesions', 'neck_rigidity', 'carotid_bruits',
			'thyromegaly', 'mm', 'jvd', 'left_ear', 'right_ear', 'tm', 'ear_canal', 'nose', 'throat',
			'comment'];
		
		var values = $.map(peEnt, function(k,v) {
			if (k() == null || k() == undefined) {
				return [''];
			}
			else {
				return [k()];
			}
		});
		
		if (peEnt.id() == undefined || peEnt.id() == '') {
			return self.query({
				mode: 'select',
				table: 'pe_ent',
				fields: 'id',
				order: 'ORDER BY id DESC',
				limit: 'LIMIT 1'
			}).success(function(data) {
				var newId = 1;
				if (data.length > 0)
					newId = parseInt(data[0].id) + 1;
				
				values[0] = newId;
				peEnt.id(newId);
				self.query({
					mode: 'insert',
					table: 'pe_ent',
					fields: fields,
					values: values
				});
			});
		}
		else {
			return self.query({
				mode: 'update',
				table: 'pe_ent',
				fields: fields,
				values: values,
				where: "WHERE id='" + peEnt.id() + "'"
			});
		}
	}
	
	// Save EXT
	physical.prototype.savePeExt = function(peExt) {
		var self = this;
		var fields = ['id', 'service_record_id', 'type', 'clubbing', 'cyanosis', 'edema', 'skeleton_tenderness',
			'joints', 'comment'];
		
		var values = $.map(peExt, function(k,v) {
			if (k() == null || k() == undefined) {
				return [''];
			}
			else {
				return [k()];
			}
		});
		
		if (peExt.id() == undefined || peExt.id() == '') {
			return self.query({
				mode: 'select',
				table: 'pe_ext',
				fields: 'id',
				order: 'ORDER BY id DESC',
				limit: 'LIMIT 1'
			}).success(function(data) {
				var newId = 1;
				if (data.length > 0)
					newId = parseInt(data[0].id) + 1;
				
				values[0] = newId;
				peExt.id(newId);
				self.query({
					mode: 'insert',
					table: 'pe_ext',
					fields: fields,
					values: values
				});
			});
		}
		else {
			return self.query({
				mode: 'update',
				table: 'pe_ext',
				fields: fields,
				values: values,
				where: "WHERE id='" + peExt.id() + "'"
			});
		}
	}
	
	// Save EYE
	physical.prototype.savePeEye = function(peEye) {
		var self = this;
		var fields = ['id', 'service_record_id', 'type', 'perla', 'eomi', 'icterus', 'pallor', 'comment'];
		var values = $.map(peEye, function(k,v) {
			if (k() == null || k() == undefined) {
				return [''];
			}
			else {
				return [k()];
			}
		});
		
		if (peEye.id() == undefined || peEye.id() == '') {
			return self.query({
				mode: 'select',
				table: 'pe_eye',
				fields: 'id',
				order: 'ORDER BY id DESC',
				limit: 'LIMIT 1'
			}).success(function(data) {
				var newId = 1;
				if (data.length > 0)
					newId = parseInt(data[0].id) + 1;
				
				values[0] = newId;
				peEye.id(newId);
				self.query({
					mode: 'insert',
					table: 'pe_eye',
					fields: fields,
					values: values
				});
			});
		}
		else {
			return self.query({
				mode: 'update',
				table: 'pe_eye',
				fields: fields,
				values: values,
				where: "WHERE id='" + peEye.id() + "'"
			});
		}
	}
	
	// Save GEN
	physical.prototype.savePeGen = function(peGen) {
		var self = this;
		var fields = ['id', 'service_record_id', 'type', 'nutrition', 'head', 'comment'];
		var values = $.map(peGen, function(k,v) {
			if (k() == null || k() == undefined) {
				return [''];
			}
			else {
				return [k()];
			}
		});
		
		if (peGen.id() == undefined || peGen.id() == '') {
			return self.query({
				mode: 'select',
				table: 'pe_gen',
				fields: 'id',
				order: 'ORDER BY id DESC',
				limit: 'LIMIT 1'
			}).success(function(data) {
				var newId = 1;
				if (data.length > 0)
					newId = parseInt(data[0].id) + 1;
				
				values[0] = newId;
				peGen.id(newId);
				self.query({
					mode: 'insert',
					table: 'pe_gen',
					fields: fields,
					values: values
				});
			});
		}
		else {
			return self.query({
				mode: 'update',
				table: 'pe_gen',
				fields: fields,
				values: values,
				where: "WHERE id='" + peGen.id() + "'"
			});
		}
	}
	
	// Save HEME
	physical.prototype.savePeHeme = function(peHeme) {
		var self = this;
		var fields = ['id', 'service_record_id', 'type', 'cervical', 'axillary', 'inguinal', 'comment'];
		var values = $.map(peHeme, function(k,v) {
			if (k() == null || k() == undefined) {
				return [''];
			}
			else {
				return [k()];
			}
		});
		
		if (peHeme.id() == undefined || peHeme.id() == '') {
			return self.query({
				mode: 'select',
				table: 'pe_heme',
				fields: 'id',
				order: 'ORDER BY id DESC',
				limit: 'LIMIT 1'
			}).success(function(data) {
				var newId = 1;
				if (data.length > 0)
					newId = parseInt(data[0].id) + 1;
				
				values[0] = newId;
				peHeme.id(newId);
				self.query({
					mode: 'insert',
					table: 'pe_heme',
					fields: fields,
					values: values
				});
			});
		}
		else {
			return self.query({
				mode: 'update',
				table: 'pe_heme',
				fields: fields,
				values: values,
				where: "WHERE id='" + peHeme.id() + "'"
			});
		}
	}
	
	// Save LUNGS
	physical.prototype.savePeLungs = function(peLungs) {
		var self = this;
		var fields = ['id', 'service_record_id', 'type', 'ctap', 'comment'];
		var values = $.map(peLungs, function(k,v) {
			if (k() == null || k() == undefined) {
				return [''];
			}
			else {
				return [k()];
			}
		});
		
		if (peLungs.id() == undefined || peLungs.id() == '') {
			return self.query({
				mode: 'select',
				table: 'pe_lungs',
				fields: 'id',
				order: 'ORDER BY id DESC',
				limit: 'LIMIT 1'
			}).success(function(data) {
				var newId = 1;
				if (data.length > 0)
					newId = parseInt(data[0].id) + 1;
				
				values[0] = newId;
				peLungs.id(newId);
				self.query({
					mode: 'insert',
					table: 'pe_lungs',
					fields: fields,
					values: values
				});
			});
		}
		else {
			return self.query({
				mode: 'update',
				table: 'pe_lungs',
				fields: fields,
				values: values,
				where: "WHERE id='" + peLungs.id() + "'"
			});
		}
	}
	
	// Save NEURO
	physical.prototype.savePeNeuro = function(peNeuro) {
		var self = this;
		var fields = ['id', 'service_record_id', 'type', 'focus', 'cranial_nerves', 'motor_muscle_power', 'dtr',
			'sensory_deficits', 'gait', 'comment'];
		
		var values = $.map(peNeuro, function(k,v) {
			if (k() == null || k() == undefined) {
				return [''];
			}
			else {
				return [k()];
			}
		});
		
		if (peNeuro.id() == undefined || peNeuro.id() == '') {
			return self.query({
				mode: 'select',
				table: 'pe_neuro',
				fields: 'id',
				order: 'ORDER BY id DESC',
				limit: 'LIMIT 1'
			}).success(function(data) {
				var newId = 1;
				if (data.length > 0)
					newId = parseInt(data[0].id) + 1;
				
				values[0] = newId;
				peNeuro.id(newId);
				self.query({
					mode: 'insert',
					table: 'pe_neuro',
					fields: fields,
					values: values
				});
			});
		}
		else {
			return self.query({
				mode: 'update',
				table: 'pe_neuro',
				fields: fields,
				values: values,
				where: "WHERE id='" + peNeuro.id() + "'"
			});
		}
	}
	
	// Save SKIN
	physical.prototype.savePeSkin = function(peSkin) {
		var self = this;
		var fields = ['id', 'service_record_id', 'type', 'ecchymoses', 'patechiae', 'rash', 'comment'];
		var values = $.map(peSkin, function(k,v) {
			if (k() == null || k() == undefined) {
				return [''];
			}
			else {
				return [k()];
			}
		});
		
		if (peSkin.id() == undefined || peSkin.id() == '') {
			return self.query({
				mode: 'select',
				table: 'pe_skin',
				fields: 'id',
				order: 'ORDER BY id DESC',
				limit: 'LIMIT 1'
			}).success(function(data) {
				var newId = 1;
				if (data.length > 0)
					newId = parseInt(data[0].id) + 1;
				
				values[0] = newId;
				peSkin.id(newId);
				self.query({
					mode: 'insert',
					table: 'pe_skin',
					fields: fields,
					values: values
				});
			});
		}
		else {
			return self.query({
				mode: 'update',
				table: 'pe_skin',
				fields: fields,
				values: values,
				where: "WHERE id='" + peSkin.id() + "'"
			});
		}
	}
	
	/**********************************************************************************************
	 * Delete Methods
	 * 
	 * These methods remove information from the database via DELETE queries
	 *********************************************************************************************/
	
	/**********************************************************************************************
	 * Query
	 * 
	 * This method is used by all other methods to execute the ajax call.
	 *********************************************************************************************/ 
	physical.prototype.query = function(data) {
		return $.getJSON('php/query.php',data);
	}
	
	/**************************************************************************************************
	 * Return class so it is usable.
	 *************************************************************************************************/
	return physical;
});