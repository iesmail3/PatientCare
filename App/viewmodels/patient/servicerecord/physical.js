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
	var UserStructures = require('modules/structures');			// User structures
	var Structures = require('modules/patientStructures');		// Structures
	var Backend = require('modules/physical');					// Module
	var Forms = require('modules/form');						// Common form elements
	var app = require('durandal/app');
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	var userStructures  = new UserStructures();
	var structures = new Structures();
	var backend = new Backend();
	var form = new Forms();
	var role = ko.observable(new userStructures.Role());
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
		role: role,
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
			
			backend.getRole(global.userId, global.practiceId).success(function(data) {
				self.role(new userStructures.Role(data[0]));
			});
			
			self.practiceId(global.practiceId);
			self.patientId(data.patientId);
			self.date(data.date);
			
			// Get Service Record
			return backend.getServiceRecord(self.patientId(), self.practiceId(), self.date()).success(function(data) {
				self.serviceRecord(new self.structures.ServiceRecord(data[0]));
			}).then(function() {
				// Get Vital Signs
				backend.getVitalSigns(self.serviceRecord().id()).success(function(data) {
					if (data.length > 0) {
						var v = new structures.VitalSigns(data[0]);
						self.vitalSigns(v);
					}
				});
				// Get ABD
				backend.getPeAbd(self.serviceRecord().id()).success(function(data) {
					if (data.length > 0) {
						var p = new structures.PeAbd(data[0]);
						self.peAbd(p);
					}
				});
				// Get CVS
				backend.getPeCvs(self.serviceRecord().id()).success(function(data) {
					if (data.length > 0) {
						var p = new structures.PeCvs(data[0]);
						self.peCvs(p);
					}
				});
				// Get CW
				backend.getPeCw(self.serviceRecord().id()).success(function(data) {
					if (data.length > 0) {
						var p = new structures.PeCw(data[0]);
						self.peCw(p);
					}
				});
				// Get ENT
				backend.getPeEnt(self.serviceRecord().id()).success(function(data) {
					if (data.length > 0) {
						var p = new structures.PeEnt(data[0]);
						self.peEnt(p);
					}
				});
				// Get EXT
				backend.getPeExt(self.serviceRecord().id()).success(function(data) {
					if (data.length > 0) {
						var p = new structures.PeExt(data[0]);
						self.peExt(p);
					}
				});
				// Get EYE
				backend.getPeEye(self.serviceRecord().id()).success(function(data) {
					if (data.length > 0) {
						var p = new structures.PeEye(data[0]);
						self.peEye(p);
					}
				});
				// Get GEN
				backend.getPeGen(self.serviceRecord().id()).success(function(data) {
					if (data.length > 0) {
						var p = new structures.PeGen(data[0]);
						self.peGen(p);
					}
				});
				// Get HEME
				backend.getPeHeme(self.serviceRecord().id()).success(function(data) {
					if (data.length > 0) {
						var p = new structures.PeHeme(data[0]);
						self.peHeme(p);
					}
				});
				// Get LUNGS
				backend.getPeLungs(self.serviceRecord().id()).success(function(data) {
					if (data.length > 0) {
						var p = new structures.PeLungs(data[0]);
						self.peLungs(p);
					}
				});
				// Get NEURO
				backend.getPeNeuro(self.serviceRecord().id()).success(function(data) {
					if (data.length > 0) {
						var p = new structures.PeNeuro(data[0]);
						self.peNeuro(p);
					}
				});
				// Get SKIN
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
		// Convert to inches
		vitalSignsInches: function() {
			var height = parseInt(vitalSigns().height());
			vitalSigns().height(Math.round(parseFloat(height*0.393701)));
		},
		// Convert to centimeters
		vitalSignsCentimeters: function() {
			var height = parseInt(vitalSigns().height());
			vitalSigns().height(Math.round(parseFloat(height*2.54)));
		},
		// Convert to pounds
		vitalSignsPounds: function() {
			var weight = parseInt(vitalSigns().weight());
			vitalSigns().weight(Math.round(parseFloat(weight*2.20462)));
		},
		// Convert to kilograms
		vitalSignsKilograms: function() {
			var weight = parseInt(vitalSigns().weight());
			vitalSigns().weight(Math.round(parseFloat(weight*0.453592)));
		},
		// Save
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
		// Clear
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
		// Save
		physicalExaminationSave: function(data) {
			// Prevents alert from showing more than once
			var saveSuccess = false;
			// Save Service Record
			backend.saveServiceRecord(patientId(), practiceId(), date(), serviceRecord()).complete(function(data) {
				if (data.responseText != 'updateFail' && data.responseText != 'insertFail' && !saveSuccess) {
					saveSuccess = true;
					$('.alert-success').fadeIn().delay(3000).fadeOut();
				}
			});
			// Save ABD
			peAbd().serviceRecordId(serviceRecord().id());
			backend.savePeAbd(peAbd()).complete(function(data) {
				if (data.responseText != 'updateFail' && data.responseText != 'insertFail' && !saveSuccess) {
					saveSuccess = true;
					$('.alert-success').fadeIn().delay(3000).fadeOut();
				}
			});
			// Save CVS
			peCvs().serviceRecordId(serviceRecord().id());
			backend.savePeCvs(peCvs()).complete(function(data) {
				if (data.responseText != 'updateFail' && data.responseText != 'insertFail' && !saveSuccess) {
					saveSuccess = true;
					$('.alert-success').fadeIn().delay(3000).fadeOut();
				}
			});
			// Save CW
			peCw().serviceRecordId(serviceRecord().id());
			backend.savePeCw(peCw()).complete(function(data) {
				if (data.responseText != 'updateFail' && data.responseText != 'insertFail' && !saveSuccess) {
					saveSuccess = true;
					$('.alert-success').fadeIn().delay(3000).fadeOut();
				}
			});
			// Save ENT
			peEnt().serviceRecordId(serviceRecord().id());
			backend.savePeEnt(peEnt()).complete(function(data) {
				if (data.responseText != 'updateFail' && data.responseText != 'insertFail' && !saveSuccess) {
					saveSuccess = true;
					$('.alert-success').fadeIn().delay(3000).fadeOut();
				}
			});
			// Save EXT
			peExt().serviceRecordId(serviceRecord().id());
			backend.savePeExt(peExt()).complete(function(data) {
				if (data.responseText != 'updateFail' && data.responseText != 'insertFail' && !saveSuccess) {
					saveSuccess = true;
					$('.alert-success').fadeIn().delay(3000).fadeOut();
				}
			});
			// Save EYE
			peEye().serviceRecordId(serviceRecord().id());
			backend.savePeEye(peEye()).complete(function(data) {
				if (data.responseText != 'updateFail' && data.responseText != 'insertFail' && !saveSuccess) {
					saveSuccess = true;
					$('.alert-success').fadeIn().delay(3000).fadeOut();
				}
			});
			// Save GEN
			peGen().serviceRecordId(serviceRecord().id());
			backend.savePeGen(peGen()).complete(function(data) {
				if (data.responseText != 'updateFail' && data.responseText != 'insertFail' && !saveSuccess) {
					saveSuccess = true;
					$('.alert-success').fadeIn().delay(3000).fadeOut();
				}
			});
			// Save HEME
			peHeme().serviceRecordId(serviceRecord().id());
			backend.savePeHeme(peHeme()).complete(function(data) {
				if (data.responseText != 'updateFail' && data.responseText != 'insertFail' && !saveSuccess) {
					saveSuccess = true;
					$('.alert-success').fadeIn().delay(3000).fadeOut();
				}
			});
			// Save LUNGS
			peLungs().serviceRecordId(serviceRecord().id());
			backend.savePeLungs(peLungs()).complete(function(data) {
				if (data.responseText != 'updateFail' && data.responseText != 'insertFail' && !saveSuccess) {
					saveSuccess = true;
					$('.alert-success').fadeIn().delay(3000).fadeOut();
				}
			});
			// Save NEURO
			peNeuro().serviceRecordId(serviceRecord().id());
			backend.savePeNeuro(peNeuro()).complete(function(data) {
				if (data.responseText != 'updateFail' && data.responseText != 'insertFail' && !saveSuccess) {
					saveSuccess = true;
					$('.alert-success').fadeIn().delay(3000).fadeOut();
				}
			});
			// Save SKIN
			peSkin().serviceRecordId(serviceRecord().id());
			backend.savePeSkin(peSkin()).complete(function(data) {
				if (data.responseText != 'updateFail' && data.responseText != 'insertFail' && !saveSuccess) {
					saveSuccess = true;
					$('.alert-success').fadeIn().delay(3000).fadeOut();
				}
			});
		},
		// Clear
		physicalExaminationClear: function() {
			return app.showMessage(
				'Are you sure you want to clear all fields for physical examinations?',
				'Delete',
				['Yes', 'No'])
			.done(function(answer){
				if(answer == 'Yes') {
					// Clear GEN
					if (isNaN(peGen().id()))
						peGen(new structures.PeGen());
					else {
						var id = peGen().id();
						peGen(new structures.PeGen());
						peGen().id(id);
					}
					// Clear EYE
					if (isNaN(peEye().id()))
						peEye(new structures.PeEye());
					else {
						var id = peEye().id();
						peEye(new structures.PeEye());
						peEye().id(id);
					}
					// Clear ENT
					if (isNaN(peEnt().id()))
						peEnt(new structures.PeEnt());
					else {
						var id = peEnt().id();
						peEnt(new structures.PeEnt());
						peEnt().id(id);
					}
					// Clear CW
					if (isNaN(peCw().id()))
						peCw(new structures.PeCw());
					else {
						var id = peCw().id();
						peCw(new structures.PeCw());
						peCw().id(id);
					}
					// Clear LUNGS
					if (isNaN(peLungs().id()))
						peLungs(new structures.PeLungs());
					else {
						var id = peLungs().id();
						peLungs(new structures.PeLungs());
						peLungs().id(id);
					}
					// Clear CVS
					if (isNaN(peCvs().id()))
						peCvs(new structures.PeCvs());
					else {
						var id = peCvs().id();
						peCvs(new structures.PeCvs());
						peCvs().id(id);
					}
					// Clear ABD
					if (isNaN(peAbd().id()))
						peAbd(new structures.PeAbd());
					else {
						var id = peAbd().id();
						peAbd(new structures.PeAbd());
						peAbd().id(id);
					}
					// Clear EXT
					if (isNaN(peExt().id()))
						peExt(new structures.PeExt());
					else {
						var id = peExt().id();
						peExt(new structures.PeExt());
						peExt().id(id);
					}
					// Clear HEME
					if (isNaN(peHeme().id()))
						peHeme(new structures.PeHeme());
					else {
						var id = peHeme().id();
						peHeme(new structures.PeHeme());
						peHeme().id(id);
					}
					// Clear SKIN
					if (isNaN(peSkin().id()))
						peSkin(new structures.PeSkin());
					else {
						var id = peSkin().id();
						peSkin(new structures.PeSkin());
						peSkin().id(id);
					}
					// Clear NEURO
					if (isNaN(peNeuro().id()))
						peNeuro(new structures.PeNeuro());
					else {
						var id = peNeuro().id();
						peNeuro(new structures.PeNeuro());
						peNeuro().id(id);
					}
				}
			});
		},
		/******************************************************************************************* 
		 * GEN
		 *******************************************************************************************/
		genNe: function() {
			// Clear GEN
			if (isNaN(peGen().id()))
				peGen(new structures.PeGen());
			else {
				var id = peGen().id();
				peGen(new structures.PeGen());
				peGen().id(id);
			}
		},
		genNormal: function() {
			peGen(new structures.PeGen({
				id: peGen().id(),
				service_record_id: peGen().serviceRecordId(),
				type: 2,
				nutrition: 'well nourished',
				head: 'atnc',
				comment: peGen().comment()
			}));
		},
		genAbn: function() {
			peGen(new structures.PeGen({
				id: peGen().id(),
				service_record_id: peGen().serviceRecordId(),
				type: 3,
				nutrition: 'poorly nourished',
				head: 'abnormal',
				comment: peGen().comment()
			}));
		},
		/******************************************************************************************* 
		 * EYE
		 *******************************************************************************************/
		eyeNe:function() {
			// Clear EYE
			if (isNaN(peEye().id()))
				peEye(new structures.PeEye());
			else {
				var id = peEye().id();
				peEye(new structures.PeEye());
				peEye().id(id);
			}
		},
		eyeNormal: function() {
			peEye(new structures.PeEye({
				id: peEye().id(),
				service_record_id: peEye().serviceRecordId(),
				type: 2,
				perla: 'yes',
				eomi: 'yes',
				icterus: 'absent',
				pallor: 'absent',
				comment: peEye().comment()
			}));
		},
		eyeAbn: function() {
			peEye(new structures.PeEye({
				id: peEye().id(),
				service_record_id: peEye().serviceRecordId(),
				type: 3,
				perla: 'no',
				eomi: 'no',
				icterus: 'present',
				pallor: 'present',
				comment: peEye().comment()
			}));
		},
		/******************************************************************************************* 
		 * ENT
		 *******************************************************************************************/
		entNe:function() {
			// Clear ENT
			if (isNaN(peEnt().id()))
				peEnt(new structures.PeEnt());
			else {
				var id = peEnt().id();
				peEnt(new structures.PeEnt());
				peEnt().id(id);
			}
		},
		entNormal: function() {
			peEnt(new structures.PeEnt({
				id: peEnt().id(),
				service_record_id: peEnt().serviceRecordId(),
				type: 2,
				oral_lesions: 'absent',
				neck_rigidity: 'absent',
				carotid_bruits: 'absent',
				thyromegaly: 'absent',
				mm: 'moist',
				jvd: 'absent',
				left_ear: 'both',
				right_ear: 'both',
				tm: 'normal',
				ear_canal: 'normal',
				nose: 'normal',
				throat: 'normal',
				comment: peEnt().comment()
			}));
		},
		entAbn: function() {
			peEnt(new structures.PeEnt({
				id: peEnt().id(),
				service_record_id: peEnt().serviceRecordId(),
				type: 3,
				oral_lesions: 'present',
				neck_rigidity: 'present',
				carotid_bruits: 'present',
				thyromegaly: 'present',
				mm: 'dry',
				jvd: 'present',
				left_ear: '',
				right_ear: '',
				tm: 'abnormal',
				ear_canal: 'abnormal',
				nose: 'abnormal',
				throat: 'abnormal',
				comment: peEnt().comment()
			}));
		},
		/******************************************************************************************* 
		 * CW
		 *******************************************************************************************/
		cwNe:function() {
			// Clear CW
			if (isNaN(peCw().id()))
				peCw(new structures.PeCw());
			else {
				var id = peCw().id();
				peCw(new structures.PeCw());
				peCw().id(id);
			}
		},
		cwNormal: function() {
			peCw(new structures.PeCw({
				id: peCw().id(),
				service_record_id: peCw().serviceRecordId(),
				type: 2,
				asymmetry: 'absent',
				chest: 'absent',
				scar: 'absent',
				comment: peCw().comment()
			}));
		},
		cwAbn: function() {
			peCw(new structures.PeCw({
				id: peCw().id(),
				service_record_id: peCw().serviceRecordId(),
				type: 3,
				asymmetry: 'present',
				chest: 'present',
				scar: 'present',
				comment: peCw().comment()
			}));
		},
		/******************************************************************************************* 
		 * LUNGS
		 *******************************************************************************************/
		lungsNe:function() {
			// Clear LUNGS
			if (isNaN(peLungs().id()))
				peLungs(new structures.PeLungs());
			else {
				var id = peLungs().id();
				peLungs(new structures.PeLungs());
				peLungs().id(id);
			}
		},
		lungsNormal: function() {
			peLungs(new structures.PeLungs({
				id: peLungs().id(),
				service_record_id: peLungs().serviceRecordId(),
				type: 2,
				ctap: 'yes',
				comment: peLungs().comment()
			}));
		},
		lungsAbn: function() {
			peLungs(new structures.PeLungs({
				id: peLungs().id(),
				service_record_id: peLungs().serviceRecordId(),
				type: 3,
				ctap: 'no',
				comment: peLungs().comment()
			}));
		},
		/******************************************************************************************* 
		 * CVS
		 *******************************************************************************************/
		cvsNe:function() {
			// Clear CVS
			if (isNaN(peCvs().id()))
				peCvs(new structures.PeCvs());
			else {
				var id = peCvs().id();
				peCvs(new structures.PeCvs());
				peCvs().id(id);
			}
		},
		cvsNormal: function() {
			peCvs(new structures.PeCvs({
				id: peCvs().id(),
				service_record_id: peCvs().serviceRecordId(),
				type: 2,
				rhythm: 'regular',
				murmur: 'absent',
				gallop: 'absent',
				rub: 'absent',
				comment: peCvs().comment()
			}));
		},
		cvsAbn: function() {
			peCvs(new structures.PeCvs({
				id: peCvs().id(),
				service_record_id: peCvs().serviceRecordId(),
				type: 3,
				rhythm: 'irregular',
				murmur: 'present',
				gallop: 'present',
				rub: 'present',
				comment: peCvs().comment()
			}));
		},
		/******************************************************************************************* 
		 * ABD
		 *******************************************************************************************/
		abdNe:function() {
			// Clear ABD
			if (isNaN(peAbd().id()))
				peAbd(new structures.PeAbd());
			else {
				var id = peAbd().id();
				peAbd(new structures.PeAbd());
				peAbd().id(id);
			}
		},
		abdNormal: function() {
			peAbd(new structures.PeAbd({
				id: peAbd().id(),
				service_record_id: peAbd().serviceRecordId(),
				type: 2,
				inspection: 'normal',
				palpation: 'normal',
				percussion: 'normal',
				auscultation: 'normal',
				comment: peAbd().comment()
			}));
		},
		abdAbn: function() {
			peAbd(new structures.PeAbd({
				id: peAbd().id(),
				service_record_id: peAbd().serviceRecordId(),
				type: 3,
				inspection: 'abnormal',
				palpation: 'abnormal',
				percussion: 'abnormal',
				auscultation: 'abnormal',
				comment: peAbd().comment()
			}));
		},
		/******************************************************************************************* 
		 * EXT
		 *******************************************************************************************/
		extNe:function() {
			// Clear EXT
			if (isNaN(peExt().id()))
				peExt(new structures.PeExt());
			else {
				var id = peExt().id();
				peExt(new structures.PeExt());
				peExt().id(id);
			}
		},
		extNormal: function() {
			peExt(new structures.PeExt({
				id: peExt().id(),
				service_record_id: peExt().serviceRecordId(),
				type: 2,
				clubbing: 'absent',
				cyanosis: 'absent',
				edema: 'absent',
				skeleton_tenderness: 'absent',
				joints: 'normal',
				comment: peExt().comment()
			}));
		},
		extAbn: function() {
			peExt(new structures.PeExt({
				id: peExt().id(),
				service_record_id: peExt().serviceRecordId(),
				type: 3,
				clubbing: 'present',
				cyanosis: 'present',
				edema: 'present',
				skeleton_tenderness: 'present',
				joints: 'abnormal',
				comment: peExt().comment()
			}));
		},
		/******************************************************************************************* 
		 * HEME
		 *******************************************************************************************/
		hemeNe:function() {
			// Clear HEME
			if (isNaN(peHeme().id()))
				peHeme(new structures.PeHeme());
			else {
				var id = peHeme().id();
				peHeme(new structures.PeHeme());
				peHeme().id(id);
			}
		},
		hemeNormal: function() {
			peHeme(new structures.PeHeme({
				id: peHeme().id(),
				service_record_id: peHeme().serviceRecordId(),
				type: 2,
				cervical: 'absent',
				axillary: 'absent',
				inguinal: 'absent',
				comment: peHeme().comment()
			}));
		},
		hemeAbn: function() {
			peHeme(new structures.PeHeme({
				id: peHeme().id(),
				service_record_id: peHeme().serviceRecordId(),
				type: 3,
				cervical: 'present',
				axillary: 'present',
				inguinal: 'present',
				comment: peHeme().comment()
			}));
		},
		/******************************************************************************************* 
		 * SKIN
		 *******************************************************************************************/
		skinNe:function() {
			// Clear SKIN
			if (isNaN(peSkin().id()))
				peSkin(new structures.PeSkin());
			else {
				var id = peSkin().id();
				peSkin(new structures.PeSkin());
				peSkin().id(id);
			}
		},
		skinNormal: function() {
			peSkin(new structures.PeSkin({
				id: peSkin().id(),
				service_record_id: peSkin().serviceRecordId(),
				type: 2,
				ecchymoses: 'absent',
				patechiae: 'absent',
				rash: 'absent',
				comment: peSkin().comment()
			}));
		},
		skinAbn: function() {
			peSkin(new structures.PeSkin({
				id: peSkin().id(),
				service_record_id: peSkin().serviceRecordId(),
				type: 3,
				ecchymoses: 'present',
				patechiae: 'present',
				rash: 'present',
				comment: peSkin().comment()
			}));
		},
		/******************************************************************************************* 
		 * NEURO
		 *******************************************************************************************/
		neuroNe:function() {
			// Clear NEURO
			if (isNaN(peNeuro().id()))
				peNeuro(new structures.PeNeuro());
			else {
				var id = peNeuro().id();
				peNeuro(new structures.PeNeuro());
				peNeuro().id(id);
			}
		},
		neuroNormal: function() {
			peNeuro(new structures.PeNeuro({
				id: peNeuro().id(),
				service_record_id: peNeuro().serviceRecordId(),
				type: 2,
				focus: peNeuro().focus(),
				cranial_nerves: 'normal',
				motor_muscle_power: 'all',
				dtr: '2+',
				sensory_deficits: 'absent',
				gait: 'normal',
				comment: peNeuro().comment()
			}));
		},
		neuroAbn: function() {
			peNeuro(new structures.PeNeuro({
				id: peNeuro().id(),
				service_record_id: peNeuro().serviceRecordId(),
				type: 3,
				focus: peNeuro().focus(),
				cranial_nerves: 'abnormal',
				motor_muscle_power: '',
				dtr: '',
				sensory_deficits: 'present',
				gait: 'abnormal',
				comment: peNeuro().comment()
			}));
		}
	};
});