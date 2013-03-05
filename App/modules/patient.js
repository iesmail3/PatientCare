/**************************************************************************************************
 * Module name:
 * Author(s):
 * Description:
 *
 *************************************************************************************************/
define(function(require) {
	/**************************************************************************************************
	 * Structures
	 * 
	 * Place any structures that you need here. A structure is basically an object that acts like an 
	 * array in that it only has variables. There are no methods. An example of a structure is the
	 * Customer structure below:
	 *  
	 * function Customer(data) {
	 *	this.name  = ko.observable(data.name);
	 *	this.dob   = ko.observable(data.dob.substring(5,7) + '/' 
	 *		+ data.dob.substring(8,10) + '/' + data.dob.substring(0,4));
	 *	this.phone = ko.observable(data.phone);
	 * 	this.email = ko.observable(data.email);
	 * };
	 *************************************************************************************************/
	//function <Structure name> (parameters) {
		// place attributes here
	//}
	
	/**************************************************************************************************
	 * Constructor
	 *
	 * Below is how you write the constructor for this class. You can add parameters and initialization
	 * logic if needed.
	 *************************************************************************************************/
	var patient = function() {};
	
	/**************************************************************************************************
	 * Attributes
	 *
	 * This is where you can add attributes (variables) to the class.
	 *
	 * Ex: backend.prototype.name = "Harry";
	 *************************************************************************************************/
	 
	/**************************************************************************************************
	 * Methods
	 *
	 * This is where you can add attibutes to handle the data that comes in.
	 *
	 * Ex: backend.prototype.getCustomers(id) {
	 *	   		return customers[id];
	 * 	   };
	 *************************************************************************************************/ 
	// Get All Patients
	patient.prototype.getPatients = function() {
		return $.getJSON(
	        // Backend script
	        'php/query.php',
	        // Variables sent to query.php
	        {
	                mode: 'select',
	                table: 'patient',
	                fields: '*',
	        },
	        function(data) {
	        	self.results = data;
	        }
	    );
	}
	
	// Get Personal Information
	patient.prototype.getPatient = function(id) {
		return $.getJSON(
	        // Backend script
	        'php/query.php',
	        // Variables sent to query.php
	        {
	                mode: 'select',
	                table: 'patient',
	                fields: '*',
	                where: "WHERE id='" + id + "'"
	        },
	        // Callback function
	        function(data) {
	        }
	    );
	}
	
	// Get Insurance
	patient.prototype.getInsurance = function(id) {
		return $.getJSON(
	        // Backend script
	        'php/query.php',
	        // Variables sent to query.php
	        {
	                mode: 'select',
	                table: 'insurance',
	                fields: '*',
	                where: "WHERE patient_id='" + id + "'"
	        },
	        // Callback function
	        function(data) {
	        }
	    );
	}
	
	/**************************************************************************************************
	 * Return class so it is usable.
	 *************************************************************************************************/
	return patient;
});