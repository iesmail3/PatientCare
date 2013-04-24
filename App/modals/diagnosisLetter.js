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
		this.savedText = ko.observable(); 
		this.getPhysician();
	};
	
	// /**********************************************************************************************
	 // * Retrieve data for physician
	 // *********************************************************************************************/
	
	DiagnosisLetter.prototype.getPhysician = function(data) {
     if(self.text() == undefined) { 
		var letter = '';
		backend.getPhysician(self.patientId,self.practiceId,self.date).success(function(data) { 
			if(data.length > 0) { 
				var d = $.map(data, function(item) {
                    letter += item.first_name +  ' ' + item.last_name + ',' + item.degree + '\r\n\r\n'; 
				});
			    backend.getPatient(self.patientId).success(function(data) { 
					if(data.length > 0) { 
						var d = $.map(data, function(item) {
							letter += 'RE :' + item.first_name +  ' ' + item.last_name + ', DOB: '
							+ item.date_of_birth + '\r\n\r\n'; 
						}); 
					
						backend.getServiceRecord(self.date).success(function(data) { 
							if(data.length > 0) { 
								var d = $.map(data, function(item) { 
									letter+= 'Dear Dr.' + '\r\n' + 'I saw the above patient in the office on ' + self.date + 
											  ' for ' + item.systems_comment + ' evaluation of -' + '\r\n\r\n'; 
								}); 
							
								backend.getDiagnosis(self.patientId,self.practiceId,self.date).success(function(data) { 
										var diagnosis = ''; 
										if(data.length > 0) { 
											var d = $.map(data, function(item) { 
												 diagnosis+= item.diagnosis + '\r\n';
											}); 
											letter += diagnosis + '\r\n\r\n';
											 letter+= 'My Recommendations are as follows' + '\r\n\r\n\r\n';
											 letter+= 'I appreciate your trust in our service. If you have any questions, do not hesitate to call me' + 
													  '\r\n\r\n\r\n'; 
											letter+= 'Thank You \r\n\r\n\r\n'; 
											letter+= 'Sincerely \r\n\r\n\r\n';
											//system.log(letter); 
											self.text(letter); 
										}
								});
							}
						}); 
					}
				});
			}
		});
      }		
	}
	
	DiagnosisLetter.prototype.saveLetter  = function(data) { 
	self.savedText(self.text()); 
	system.log(self.savedText()); 
	
	}; 
  
    
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