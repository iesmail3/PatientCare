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
		var letter = '';
		backend.getReferringPhysician(self.patientId).success(function(data) { 
			if(data.length > 0) { 
				var d = $.map(data, function(item) {
                    letter += item.first_name +  ' ' + item.last_name + ',' + item.degree + '\n\n'; 
				});
			    backend.getPatient(self.patientId).success(function(data) { 
					if(data.length > 0) { 
						var d = $.map(data, function(item) {
							letter += 'RE :' + item.first_name +  ' ' + item.last_name + ', DOB: '
							+ item.date_of_birth + '\n'; 
						}); 
					
						backend.getServiceRecord(self.date).success(function(data) { 
							if(data.length > 0) { 
								var d = $.map(data, function(item) { 
									letter+= 'Dear Dr.  \n\n I saw the above patient in the office on ' + self.date + 
											  ' for ' + item.systems_comment + ' evaluation of - \n'; 
								}); 
							
								backend.getDiagnosis(self.patientId,self.practiceId,self.date).success(function(data) { 
										var diagnosis = ''; 
										if(data.length > 0) { 
											var d = $.map(data, function(item) { 
												 diagnosis+= item.diagnosis + '\n';
											}); 
											letter += diagnosis + '\n';
											 letter+= 'My Recommendations are as follows: \n\n\n';
											 letter+= 'I appreciate your trust in our service. If you have any questions, do not hesitate to call me \n\n'; 
											letter+= 'Thank You \n\n'; 
											letter+= 'Sincerely \n';
											backend.getPhysician(self.patientId,self.practiceId,self.date).success(function(data) { 
											   var m = '';
												if(data.length > 0) { 
													var d = $.map(data, function(item) {
													letter += item.first_name +  ' ' + item.last_name + ',' + item.degree + '\n\n'; 
													 self.text(letter);
													});
													
										 
													system.log(letter); 
												}
										   });
										   
								           
										}       
							  });
							 
							}
						});
					}
				});
			}
		});
	}
	DiagnosisLetter.prototype.printLetter  = function(data) { 
		//self.savedText(self.text()); 
		backend.saveLetter(self.patientId, self.practiceId,self.date,self.text); 
		var height = $('.flowHolder').height();
		var settings = 'directories=no, height=' + height + ', width=800, location=yes, ' +
				   'menubar=no, status=no, titlebar=no, toolbar=no';
		var win = window.open(
				'php/printLetter.php/?patientId=' + self.patientId + '&practiceId=' + 
				self.practiceId + '&date=' + self.date				
				,					
				'',
				settings
			);
	}; 
  
    
	DiagnosisLetter.prototype.selectOption = function(dialogResult) {
		this.modal.close(dialogResult);
	};
 
    DiagnosisLetter.prototype.closeWindow = function(data) {
		this.modal.close('close');
	};
	
	DiagnosisLetter.defaultTitle = '';
	DiagnosisLetter.defaultOptions = ['Save','Cancel'];
	
	return DiagnosisLetter;	
});