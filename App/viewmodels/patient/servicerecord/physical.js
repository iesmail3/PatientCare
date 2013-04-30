/***************************************************************************************************
 * ViewModel:
 * Author(s):
 * Description: 
 **************************************************************************************************/
define(function(require) { 
	/*********************************************************************************************** 
	 * Includes*
	 **********************************************************************************************/
	var system = require('durandal/system');					// System logger
	var custom = require('durandal/customBindings');			// Custom bindings
	var Structures = require('modules/patientStructures');		// Structures
	var Backend = require('modules/physical');					// Module
	var Forms = require('modules/form');						// Common form elements
	var app = require('durandal/app');
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	var structures = new Structures();
	var backend = new Backend();
	var form = new Forms();
	var practiceId = ko.observable();
	var patientId = ko.observable();
	var date = ko.observable();
	var serviceRecord = ko.observable(new structures.ServiceRecord());
	var vitalSigns = ko.observable(new structures.VitalSigns());
	var peGen = ko.observable(new structures.PeGen());
	var peEye = ko.observable(new structures.PeEye());
	var peEnt = ko.observable(new structures.PeEnt());
	var peCw = ko.observable(new structures.PeCw());
	var peLungs = ko.observable(new structures.PeLungs());
	var peCvs = ko.observable(new structures.PeCvs());
	var peAbd = ko.observable(new structures.PeAbd());
	var peExt = ko.observable(new structures.PeExt());
	var peHeme = ko.observable(new structures.PeHeme());
	var peSkin = ko.observable(new structures.PeSkin());
	var peNeuro = ko.observable(new structures.PeNeuro());

	/*********************************************************************************************** 
	 * KO Computed Functions
	 **********************************************************************************************/
	 // var computedFunction = ko.computed(function() {});

	/*********************************************************************************************** 
	 * ViewModel
	 *
	 * For including ko observables and computed functions, add an attribute of the same name.
	 * Ex: observable: observable
	 **********************************************************************************************/
	return {
		/******************************************************************************************* 
		 * Attributes
		 *******************************************************************************************/
		structures: structures,
		backend: backend,
		practiceId: practiceId,
		patientId: patientId,
		date: date,
		serviceRecord: serviceRecord,
		vitalSigns: vitalSigns,
		peGen: peGen,
		peEye: peEye,
		peEnt: peEnt,
		peCw: peCw,
		peLungs: peLungs,
		peCvs: peCvs,
		peAbd: peAbd,
		peExt: peExt,
		peHeme: peHeme,
		peSkin: peSkin,
		peNeuro: peNeuro,
		
		/******************************************************************************************* 
		 * Methods
		 *******************************************************************************************/
		// This allow manipulation of the DOM
		viewAttached: function() {
			$('#serviceTab a').click(function(e) {
				e.preventDefault();
  				$(this).tab('show');
			});
			
			// Resize tree and content pane
			$('.tab-pane').height(parseInt($('.contentPane').height()) - 62);
			$('.vitalSignsFormScroll').height(parseInt($('.contentPane').height()) - 126);
			$('.physicalFormScroll').height(parseInt($('.contentPane').height()) - 146);
			$(window).resize(function() {
				$('.tab-pane').height(parseInt($('.contentPane').height()) - 62);
				$('.vitalSignsFormScroll').height(parseInt($('.contentPane').height()) - 126);
				$('.physicalFormScroll').height(parseInt($('.contentPane').height()) - 146);
			});
		},
		// Loads when view is loaded
		activate: function(data) {
			var self = this;
			
			self.practiceId(global.practiceId);
			self.patientId(data.patientId);
			self.date(data.date);
			
			// Need to do module for this
			return backend.getServiceRecord(self.patientId(), self.practiceId(), self.date()).success(function(data) {
				self.serviceRecord(new self.structures.ServiceRecord(data[0]));
			}).then(function() {
				backend.getVitalSigns(self.serviceRecord().id()).success(function(data) {
					if (data.length > 0) {
						var v = new structures.VitalSigns(data[0]);
						self.vitalSigns(v);
					}
				});
				
				backend.getPeAbd(self.serviceRecord().id()).success(function(data) {
					if (data.length > 0) {
						var p = new structures.PeAbd(data[0]);
						self.peAbd(p);
					}
				});
				
				backend.getPeCvs(self.serviceRecord().id()).success(function(data) {
					if (data.length > 0) {
						var p = new structures.PeCvs(data[0]);
						self.peCvs(p);
					}
				});
				
				backend.getPeCw(self.serviceRecord().id()).success(function(data) {
					if (data.length > 0) {
						var p = new structures.PeCw(data[0]);
						self.peCw(p);
					}
				});
				
				backend.getPeEnt(self.serviceRecord().id()).success(function(data) {
					if (data.length > 0) {
						var p = new structures.PeEnt(data[0]);
						self.peEnt(p);
					}
				});
				
				backend.getPeExt(self.serviceRecord().id()).success(function(data) {
					if (data.length > 0) {
						var p = new structures.PeExt(data[0]);
						self.peExt(p);
					}
				});
				
				backend.getPeEye(self.serviceRecord().id()).success(function(data) {
					if (data.length > 0) {
						var p = new structures.PeEye(data[0]);
						self.peEye(p);
					}
				});
				
				backend.getPeGen(self.serviceRecord().id()).success(function(data) {
					if (data.length > 0) {
						var p = new structures.PeGen(data[0]);
						self.peGen(p);
					}
				});
				
				backend.getPeHeme(self.serviceRecord().id()).success(function(data) {
					if (data.length > 0) {
						var p = new structures.PeHeme(data[0]);
						self.peHeme(p);
					}
				});
				
				backend.getPeLungs(self.serviceRecord().id()).success(function(data) {
					if (data.length > 0) {
						var p = new structures.PeLungs(data[0]);
						self.peLungs(p);
					}
				});
				
				backend.getPeNeuro(self.serviceRecord().id()).success(function(data) {
					if (data.length > 0) {
						var p = new structures.PeNeuro(data[0]);
						self.peNeuro(p);
					}
				});
				
				backend.getPeSkin(self.serviceRecord().id()).success(function(data) {
					if (data.length > 0) {
						var p = new structures.PeSkin(data[0]);
						self.peSkin(p);
					}
				});
			});
		}, // End Activate
		/******************************************************************************************* 
		 * Vital Signs
		 *******************************************************************************************/
		vitalSignsInches: function() {
			var height = parseInt(vitalSigns().height());
			vitalSigns().height(Math.round(parseFloat(height*0.393701)));
		},
		vitalSignsCentimeters: function() {
			var height = parseInt(vitalSigns().height());
			vitalSigns().height(Math.round(parseFloat(height*2.54)));
		},
		vitalSignsPounds: function() {
			var weight = parseInt(vitalSigns().weight());
			vitalSigns().weight(Math.round(parseFloat(weight*2.20462)));
		},
		vitalSignsKilograms: function() {
			var weight = parseInt(vitalSigns().weight());
			vitalSigns().weight(Math.round(parseFloat(weight*0.453592)));
		},
		vitalSignsSave: function(data) {
			if (isNaN(vitalSigns().serviceRecordId())) {
				vitalSigns().serviceRecordId(serviceRecord().id());
				backend.saveVitalSigns(vitalSigns(), 'insert').complete(function(data) {
					if (data.responseText != 'insertFail')
						$('.alert-success').fadeIn().delay(3000).fadeOut();
				});
			}
			else {
				backend.saveVitalSigns(vitalSigns(), 'update').complete(function(data) {
					if (data.responseText != 'updateFail')
						$('.alert-success').fadeIn().delay(3000).fadeOut();
				});
			}
		},
		vitalSignsClear: function() {
			return app.showMessage(
				'Are you sure you want to clear all fields for vital signs?',
				'Delete',
				['Yes', 'No'])
			.done(function(answer){
				if(answer == 'Yes') {
					if (isNaN(vitalSigns().serviceRecordId()))
						vitalSigns(new structures.VitalSigns());
					else {
						vitalSigns(new structures.VitalSigns());
						vitalSigns().serviceRecordId(serviceRecord().id());
					}
				}
			});
		},
		/******************************************************************************************* 
		 * Physical Examination
		 *******************************************************************************************/
		physicalExaminationSave: function(data) {
			var saveSuccess = false;
			backend.saveServiceRecord(patientId(), practiceId(), date(), serviceRecord()).complete(function(data) {
				if (data.responseText != 'updateFail' && data.responseText != 'insertFail' && !saveSuccess) {
					saveSuccess = true;
					$('.alert-success').fadeIn().delay(3000).fadeOut();
				}
			});
			peAbd().serviceRecordId(serviceRecord().id());
			backend.savePeAbd(peAbd()).complete(function(data) {
				if (data.responseText != 'updateFail' && data.responseText != 'insertFail' && !saveSuccess) {
					saveSuccess = true;
					$('.alert-success').fadeIn().delay(3000).fadeOut();
				}
			});
			peCvs().serviceRecordId(serviceRecord().id());
			backend.savePeCvs(peCvs()).complete(function(data) {
				if (data.responseText != 'updateFail' && data.responseText != 'insertFail' && !saveSuccess) {
					saveSuccess = true;
					$('.alert-success').fadeIn().delay(3000).fadeOut();
				}
			});
			peCw().serviceRecordId(serviceRecord().id());
			backend.savePeCw(peCw()).complete(function(data) {
				if (data.responseText != 'updateFail' && data.responseText != 'insertFail' && !saveSuccess) {
					saveSuccess = true;
					$('.alert-success').fadeIn().delay(3000).fadeOut();
				}
			});
			peEnt().serviceRecordId(serviceRecord().id());
			backend.savePeEnt(peEnt()).complete(function(data) {
				if (data.responseText != 'updateFail' && data.responseText != 'insertFail' && !saveSuccess) {
					saveSuccess = true;
					$('.alert-success').fadeIn().delay(3000).fadeOut();
				}
			});
			peExt().serviceRecordId(serviceRecord().id());
			backend.savePeExt(peExt()).complete(function(data) {
				if (data.responseText != 'updateFail' && data.responseText != 'insertFail' && !saveSuccess) {
					saveSuccess = true;
					$('.alert-success').fadeIn().delay(3000).fadeOut();
				}
			});
			peEye().serviceRecordId(serviceRecord().id());
			backend.savePeEye(peEye()).complete(function(data) {
				if (data.responseText != 'updateFail' && data.responseText != 'insertFail' && !saveSuccess) {
					saveSuccess = true;
					$('.alert-success').fadeIn().delay(3000).fadeOut();
				}
			});
			peGen().serviceRecordId(serviceRecord().id());
			backend.savePeGen(peGen()).complete(function(data) {
				if (data.responseText != 'updateFail' && data.responseText != 'insertFail' && !saveSuccess) {
					saveSuccess = true;
					$('.alert-success').fadeIn().delay(3000).fadeOut();
				}
			});
			peHeme().serviceRecordId(serviceRecord().id());
			backend.savePeHeme(peHeme()).complete(function(data) {
				if (data.responseText != 'updateFail' && data.responseText != 'insertFail' && !saveSuccess) {
					saveSuccess = true;
					$('.alert-success').fadeIn().delay(3000).fadeOut();
				}
			});
			peLungs().serviceRecordId(serviceRecord().id());
			backend.savePeLungs(peLungs()).complete(function(data) {
				if (data.responseText != 'updateFail' && data.responseText != 'insertFail' && !saveSuccess) {
					saveSuccess = true;
					$('.alert-success').fadeIn().delay(3000).fadeOut();
				}
			});
			peNeuro().serviceRecordId(serviceRecord().id());
			backend.savePeNeuro(peNeuro()).complete(function(data) {
				if (data.responseText != 'updateFail' && data.responseText != 'insertFail' && !saveSuccess) {
					saveSuccess = true;
					$('.alert-success').fadeIn().delay(3000).fadeOut();
				}
			});
			peSkin().serviceRecordId(serviceRecord().id());
			backend.savePeSkin(peSkin()).complete(function(data) {
				if (data.responseText != 'updateFail' && data.responseText != 'insertFail' && !saveSuccess) {
					saveSuccess = true;
					$('.alert-success').fadeIn().delay(3000).fadeOut();
				}
			});
		},
		physicalExaminationClear: function() {
			return app.showMessage(
				'Are you sure you want to clear all fields for physical examinations?',
				'Delete',
				['Yes', 'No'])
			.done(function(answer){
				if(answer == 'Yes') {
					peGen(new structures.PeGen());
					peEye(new structures.PeEye());
					peEnt(new structures.PeEnt());
					peCw(new structures.PeCw());
					peLungs(new structures.PeLungs());
					peCvs(new structures.PeCvs());
					peAbd(new structures.PeAbd());
					peExt(new structures.PeExt());
					peHeme(new structures.PeHeme());
					peSkin(new structures.PeSkin());
					peNeuro(new structures.PeNeuro());
				}
			});
		}
	};
});