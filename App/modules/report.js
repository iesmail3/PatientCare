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
	 report.prototype.getDocument = function(id, practiceId, date) {
		return this.query({
			mode: 'select',
			table: 'document',
			fields: '*',
			where: "WHERE patient_id='" + id + "' AND practice_id='" + practiceId + "' AND date_of_service='" + date + "'"
		});
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
	