define(function(require) {
	var system = require('durandal/system');
	var Backend = require('modules/diagnosis');
	var Structures = require('modules/patientStructures');
	var backend = new Backend(); 
	var self; 
	
	var DiagnosisLetter = function(title,patientId,practiceId,date,options) { 
		self = this; 
		this.title = title || DiagnosisLetter.defaultTitle; 
		this.patientId = patientId || DiagnosisLetter.patientId; 
		this.practiceId = practiceId || DiagnosisLetter.practiceId; 
		this.date = date || DiagnosisLetter.date; 
		this.options = options || DiagnosisLetter.defaultOptions;
		this.text = ko.observable(); 
	};
	
	// /**********************************************************************************************
	 // * Retrieve data for physician
	 // *********************************************************************************************/
	
	DiagnosisLetter.prototype.getPhysician = function(data) {
		var letter = '';
		backend.getPhysician(self.patientId,self.practiceId,self.date).success(function(data) { 
			if(data.length > 0) { 
				var d = $.map(data, function(item) {
                    letter += item.first_name +  ' ' + item.last_name + ',' + item.degree + '\r\n'; 
				});  
			}
		}); 
		
		backend.getPatient(self.patientId).success(function(data) { 
			if(data.length > 0) { 
				var d = $.map(data, function(item) {
                    letter += 'RE :' + item.first_name +  ' ' + item.last_name + ', DOB: ' + item.date_of_birth + '\r\n'; 
				});  
			}
		});

		backend.getServiceRecord(self.date).success(function(data) { 
			if(data.length > 0) { 
				var d = $.map(data, function(item) { 
					letter+= 'Dear Dr.' + '\r\n' + 'I saw the above patient in the office on ' + self.date + 
							  ' for ' + item.systems_comment + ' evaluation of -' + '\r\n'; 
				});  
			}
		}); 
		
		backend.getDiagnosis(self.patientId,self.practiceId,self.date).success(function(data) { 
			var diagnosis = ''; 
			if(data.length > 0) { 
				var d = $.map(data, function(item) { 
					 diagnosis+= item.diagnosis + '\r\n';
				}); 
				letter += diagnosis;
				 system.log(letter); 
			}
		}); 
		
	
	}
	
	DiagnosisLetter.prototype.selectOption = function(dialogResult) {
		this.modal.close(dialogResult);
	};
 
    DiagnosisLetter.prototype.closeWindow = function(data) {
		this.modal.close("close");
	};
	
	DiagnosisLetter.defaultTitle = '';
	DiagnosisLetter.defaultOptions = ['Save','Cancel'];
	
	return DiagnosisLetter;	
});