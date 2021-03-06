/**************************************************************************************************
 * Module name: Report
 * Author(s): Imran Esmail 
 * Description: This module is used to query the database.
 *************************************************************************************************/
 define(function(require) {
	/*********************************************************************************************** 
	 * Includes*
	 **********************************************************************************************/
	var system = require('durandal/system');			    // System logger
	var Forms = require('modules/form');					// Common form elements
	var form = new Forms(); 
	/**********************************************************************************************
	 * Constructor
	 *********************************************************************************************/
	var  report = function() {};
	/**********************************************************************************************
	 * Get Methods
	 * 
	 * These methods retrieve information from the database via SELECT queries
	 *********************************************************************************************/
	 // Role
	report.prototype.getRole = function(id, practiceId) {
		return this.query({
			mode: 'select', 
			table: 'user', 
			fields: '*',
			join: "JOIN role ON user.role_id=role.id",
			where: "WHERE user.id='" + id +"' AND user.practice_id='" + practiceId + "'"
		});
	}
	 //Get Report 
	 report.prototype.getDocument = function(id, practiceId, date) {
		return this.query({
			mode: 'select',
			table: 'document',
			fields: '*',
			where: "WHERE patient_id='" + id + "' AND practice_id='" + practiceId + "' AND date='" + date + "'"
		});
	}
	// Get Report by Type 
	report.prototype.getDocumentByType = function(patientId, practiceId, type) {
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
	/**********************************************************************************************
	 * Save Methods
	 * 
	 * These methods save information to the database via INSERT and UPDATE queries
	 *********************************************************************************************/
	// Save Document
	report.prototype.saveDocument = function(doc,documents,practiceId,patientId,date) {
		var self = this;
		// Convert true/false to 1/0
		doc.isReviewed(doc.isReviewed() ? 1 : 0);
        doc.isUnknown(doc.isUnknown() ? 1 : 0);
		var fields = ['id', 'patient_id','practice_id','service_record_id', 'location', 'type', 'date', 'comment', 
					  'is_reviewed', 'is_report', 'date_of_service','is_unknown'];
		var values = $.map(doc, function(k, v) {
			if(k() == null || k() == undefined)
				return [''];
			else
				return [k()];
		}); 
        values[1] = patientId();
		values[2] = practiceId();  
		values[6] = date;
		values[10] = form.dbDate(doc.dateOfService()); 
			
		if(values[0] != "") { 
			self.query({
				mode: 'update',
				table: 'document',
				fields: fields,
				values: values,
				where: "WHERE id='" + doc.id() + "' AND practice_id='" + practiceId + "'"
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
				values[0] = newId;
				doc.id(newId);
				doc.date(form.uiDate(date)); 
				
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
	
	// /**********************************************************************************************
	 // * Query
	 // * 
	 // * This method is used by all other methods to execute the ajax call.
	 // *********************************************************************************************/ 
	report.prototype.query = function(data) {
		return $.getJSON('php/query.php',data);
	}
	
 return report;
});
	