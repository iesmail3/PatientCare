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
	var Forms = require('modules/form');
	var forms = new Forms();
	
	/**********************************************************************************************
	 * Constructor
	 *********************************************************************************************/
	var settings = function() {};
	
	/**********************************************************************************************
	 * Get Methods
	 * 
	 * These methods retrieve information from the database via SELECT queries
	 *********************************************************************************************/
	// Get Logged in User
	settings.prototype.getCurrentUser = function(id) {
		return this.query({
			mode: 'select', 
			table: 'user', 
			fields: '*',
			join: "JOIN role ON user.role_id=role.id",
			WHERE: "WHERE user.id='" + id + "'"
		});
	}
	
	// Get Users
	settings.prototype.getUsers = function(id) {
		return this.query({
			mode: 'select', 
			table: 'user', 
			fields: '*',
			join: "JOIN role ON user.role_id=role.id",
			WHERE: "WHERE user.practice_id='" + id + "'"
		});
	}
		
	// Get Roles
	settings.prototype.getRoles = function(id) {
		return this.query({
			mode: 'select', 
			table: 'role', 
			fields: '*',
			WHERE: "WHERE practice_id='" + id + "'"
		});
	}
	
	/**********************************************************************************************
	 * Save Methods
	 * 
	 * These methods add information to the database via INSERT and UPDATE queries
	 *********************************************************************************************/
	// Save Role
	settings.prototype.saveRole = function(data) {
		var self = this;
		var fields = ['id','practice_id','name','description','superbill','allergies',
					  'birth_history','clinic_details','change_password','checkout','copay_collection',
					  'development','diagnosis','family_history','follow_up','guidance','history',
					  'history_illness','immunization','instructions','insurance',
					  'insurance_verification','reports','manage_patients','manage_physician',
					  'manage_practice_type','manage_reason_code','manage_roles','manage_schedule',
					  'manage_users','medical_problems','medication','medication_orders','misc_docs',
					  'orders','other_options','personal_information','phone_log','physical_Examination',
					  'prescription','review_of_systems','routine_exam','security','service_record',
					  'social_history','patient_superbill','vital_signs','diagnosis_instructions',
					  'physical_examination_sub'];
					  
		var values = $.map(data, function(k,v) {
			if(k() == null || k() == undefined) {
				return [''];
			}
			else
				return [k()];
		});
		
		if(values[0] != "") {
			return self.query({
				mode: 'update',
				table: 'role',
				fields: fields,
				values: values,
				where: "WHERE id='" + data.id() + "'"
			});	
		}
		else {
			return self.query({
				mode: 'select',
				table: 'role',
				fields: 'id',
				order: "ORDER BY id DESC",
				LIMIT: "LIMIT 1" 
			}).success(function(d) {
				var id = 1;
				if(d.length > 0)
					id = parseInt(d[0].id) + 1;
				data.id(id);
				values[0] = id;
				return self.query({
					mode: 'insert',
					table: 'role',
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
	// Delete Role
	settings.prototype.deleteRole = function(id) {
		return this.query({
			mode: 'delete', 
			table: 'role', 
			where: "WHERE id='" + id + "'"
		});
	}
		
	/**********************************************************************************************
	 * Query
	 * 
	 * This method is used by all other methods to execute the ajax call.
	 *********************************************************************************************/ 
	settings.prototype.query = function(data) {
		return $.getJSON('php/query.php',data);
	}
	
	/**************************************************************************************************
	 * Return class so it is usable.
	 *************************************************************************************************/
	return settings;
});