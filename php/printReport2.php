<?php
/**************************************************************************************************
 * File: Print Report 1
 * Author: Gary Chang
 * Description: This script creates a pdf containing information for the service record report.
 *************************************************************************************************/
 
header("charset=utf-8");
/**************************************************************************************************
 * Includes
 *************************************************************************************************/
// Mysql
include('connect_to_mysql.php');
// FPDF
include_once('fpdf/fpdf.php');
include_once('fpdf/fpdi.php');
include_once('fpdf/cellfit.php');

/**************************************************************************************************
 * Get Variables
 *************************************************************************************************/
$practiceId         = $_GET['practiceId'];
$patientId          = $_GET['patientId'];
$serviceRecordId    = $_GET['serviceRecordId'];

/**************************************************************************************************
 * Custom PDF Class
 *************************************************************************************************/
class PDF extends FPDI_CellFit {
	
	function Header() {
 		$practiceId			= $_GET['practiceId'];
		$patientId			= $_GET['patientId'];
		$serviceRecordId	= $_GET['serviceRecordId'];
		$patient			= array();
		$reference			= array();
		$physician			= array();
		$reviewOfSystems	= array();
		$currentProblem		= array();
		$otherProblem		= array();
		$pastProblem		= array();
		$medication			= array();
		$allergies			= array();
		$vitalSigns			= array();
		$abd				= array();
		$cvs				= array();
		$cw					= array();
		$ent				= array();
		$ext				= array();
		$eye				= array();
		$gen				= array();
		$heme				= array();
		$lungs				= array();
		$neuro				= array();
		$skin				= array();
		$reports			= array();
		$diagnosis			= array();
		$followup			= array();
		
		/******************************************************************************************
 		 * Get needed data from database
 		 *****************************************************************************************/
 		try {
 		 	// Connection script
 		 	require('connect_to_mysql.php');
			// Patient
			$stmt = $db->query("SELECT patient.*, service_record.*
								FROM service_record 
								LEFT JOIN patient 
								ON service_record.patient_id=patient.id 
								WHERE service_record.id='$serviceRecordId'");
			$stmt->setFetchMode(PDO::FETCH_ASSOC);
			$rows = $stmt->fetchAll();
			$patient = $rows[0];
			
			// Referral
			$stmt = $db->query("SELECT reference.*
								FROM reference
								WHERE patient_id='$patientId' AND practice_id='$practiceId' AND type='referringphysician'");
			$stmt->setFetchMode(PDO::FETCH_ASSOC);
			$rows = $stmt->fetchAll();
			if(count($rows) > 0)
				$reference = $rows[0];
			
			// Physician
 		 	$stmt = $db->query("SELECT physician.* 
								FROM service_record 
								LEFT JOIN physician 
								ON service_record.physician_id=physician.id 
								WHERE service_record.id='$serviceRecordId'");
			$stmt->setFetchMode(PDO::FETCH_ASSOC);
			while($row = $stmt->fetch())
				$physician = $row;
 		}
		catch (PDOException $e) {
			echo $e->getMessage() . "<br>";
		}
		
		/******************************************************************************************
		 * Patient Information
		 *****************************************************************************************/
		$this->SetFont('Arial', 'B', 11);
		$this->Cell(32, 8, 'Date of Service: ', 0, 0);
		$this->SetFont('Arial', '', 11);
		$this->Cell(0, 8, $patient['date'], 0, 0);
		$this->SetFont('Arial', 'B', 14);
		$this->Cell(0, 8, $patient['first_name'] . ' ' . $patient['middle_name'] . ' ' . $patient['last_name'], 0, 2, 'R');
		$this->SetFont('Arial', '', 11);
		$this->Cell(0, 5, $this->dobToAge($patient['date_of_birth']) . ' old ' . $patient['gender'] . ' DOB: ' . $patient['date_of_birth'], 0, 2, 'R');
		$this->Cell(0, 5, $patient['address'] . ', ' . $patient['city'] . ', ' . $patient['state'] . ' ' . $patient['zip'], 0, 2, 'R');
		$this->Cell(0, 5, 'Phone: ' . $patient['phone'], 0, 2, 'R');
		if(count($reference) > 0)
			$this->Cell(0, 5, 'Ref by: ' . $reference['first_name'] . ' ' . $reference['middle_name'] . ' ' . $reference['last_name'] . ', ' . $reference['degree'], 0, 1, 'R');
		$y = $this->GetY() + 2;
		$this->Line(11, $y, 199, $y);
		
		/******************************************************************************************
		 * Patient Information
		 *****************************************************************************************/
		$this->SetY($this->GetY() + 5);
		$this->SetFont('Arial', 'B', 9);
		$this->Cell(18, 5, 'Physician: ', 0, 0);
		$this->SetFont('Arial', '', 9);
		$this->Cell(0, 5, $physician['first_name'] . ' ' . $physician['last_name'] . ', ' . $physician['degree'] . ' [License: ' . $physician['license'] . ', NPI: ' . $physician['npi'] . ', DEA: ' . $physician['dea'], 0, 1);
		$this->SetFont('Arial', 'B', 9);
		$this->Cell(38, 5, 'Reason of Appointment: ', 0, 0);
		$this->SetFont('Arial', '', 9);
		$this->Cell(0, 5, $patient['reason'], 0, 1);
		$y = $this->GetY() + 2;
		$this->Line(11, $y, 199, $y);
		$this->SetY($this->GetY() + 6);
	}
	
	function Footer() {
		// Position at 1.5 cm from bottom
	    $this->SetY(-15);
	    // Arial italic 8
	    $this->SetFont('Arial','',8);
	    // Page number
	    $this->Cell(0,10,'Page '.$this->PageNo().' of {nb}',0,0,'C');
	}
	
	function dobToAge($date) {
		$today = date('Y-m-d');
		$dif = abs(strtotime($today) - strtotime($date));
		$years = floor($dif / 365 / 60 / 60 / 24);
		return $years . ' yrs.';
	}
}

/***************************************************************************************************
 * Pull Data from Database
 **************************************************************************************************/
// Patient
$stmt = $db->query("SELECT patient.*, service_record.*
					FROM service_record 
					LEFT JOIN patient 
					ON service_record.patient_id=patient.id 
					WHERE service_record.id='$serviceRecordId'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
$patient = $rows[0];

$stmt = $db->query("SELECT *
					FROM review_of_systems
					WHERE service_record_id='$serviceRecordId'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
$reviewOfSystems = $rows;

$stmt = $db->query("SELECT *
					FROM medical_problem
					WHERE service_record_id='$serviceRecordId' AND type='Current Medical Problem'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
$currentProblem = $rows;

$stmt = $db->query("SELECT *
					FROM medical_problem
					WHERE service_record_id='$serviceRecordId' AND type='Other Medical Problem'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
$otherProblem = $rows;

$stmt = $db->query("SELECT *
					FROM medical_problem
					WHERE service_record_id='$serviceRecordId' AND type='Past Surgical History'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
$pastProblem = $rows;

$stmt = $db->query("SELECT *
					FROM medication
					WHERE service_record_id='$serviceRecordId'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
$medication = $rows;

$stmt = $db->query("SELECT *
					FROM allergies_intolerance
					WHERE service_record_id='$serviceRecordId'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
$allergies = $rows;

$stmt = $db->query("SELECT *
					FROM vital_signs
					WHERE service_record_id='$serviceRecordId'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
if(count($rows) > 0)
	$vitalSigns = $rows[0];
else
	$vitalSigns = null;

$stmt = $db->query("SELECT *
					FROM pe_abd
					WHERE service_record_id='$serviceRecordId'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
if(count($rows) > 0)
	$abd = $rows[0];
else
	$abd = null;

$stmt = $db->query("SELECT *
					FROM pe_cvs
					WHERE service_record_id='$serviceRecordId'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
if(count($rows) > 0)
	$cvs = $rows[0];
else
	$cvs = null;

$stmt = $db->query("SELECT *
					FROM pe_cw
					WHERE service_record_id='$serviceRecordId'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
if(count($rows) > 0)
	$cw = $rows[0];
else
	$cw = null;

$stmt = $db->query("SELECT *
					FROM pe_ent
					WHERE service_record_id='$serviceRecordId'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
if(count($rows) > 0)
	$ent = $rows[0];
else
	$ent = null;

$stmt = $db->query("SELECT *
					FROM pe_ext
					WHERE service_record_id='$serviceRecordId'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
if(count($rows) > 0)
	$ext = $rows[0];
else
	$ext = null;

$stmt = $db->query("SELECT *
					FROM pe_eye
					WHERE service_record_id='$serviceRecordId'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
if(count($rows) > 0)
	$eye = $rows[0];
else
	$eye = null;

$stmt = $db->query("SELECT *
					FROM pe_gen
					WHERE service_record_id='$serviceRecordId'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
if(count($rows) > 0)
	$gen = $rows[0];
else
	$gen = null;

$stmt = $db->query("SELECT *
					FROM pe_heme
					WHERE service_record_id='$serviceRecordId'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
if(count($rows) > 0)
	$heme = $rows[0];
else
	$heme = null;

$stmt = $db->query("SELECT *
					FROM pe_lungs
					WHERE service_record_id='$serviceRecordId'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
if(count($rows) > 0)
	$lungs = $rows[0];
else
	$lungs = null;

$stmt = $db->query("SELECT *
					FROM pe_neuro
					WHERE service_record_id='$serviceRecordId'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
if(count($rows) > 0)
	$neuro = $rows[0];
else
	$neuro = null;

$stmt = $db->query("SELECT *
					FROM pe_skin
					WHERE service_record_id='$serviceRecordId'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
if(count($rows) > 0)
	$skin = $rows[0];
else
	$skin = null;

$stmt = $db->query("SELECT *
					FROM document
					WHERE patient_id='$patientId' AND service_record_id='$serviceRecordId'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
$reports = $rows;

$stmt = $db->query("SELECT *
					FROM diagnosis
					WHERE service_record_id='$serviceRecordId'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
$diagnosis = $rows;

$stmt = $db->query("SELECT *
					FROM follow_up
					WHERE service_record_id='$serviceRecordId'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
if(count($rows) > 0)
	$followup = $rows[0];
else
	$followup = null;

/***************************************************************************************************
 * Setup PDF
 **************************************************************************************************/
$pdf = new PDF();
$pdf->AliasNbPages();
$pdf->AddPage();

/***************************************************************************************************
 * History
 **************************************************************************************************/
if($patient['history'] != '') {
	$pdf->SetFont('Arial','B',10);
	$pdf->Cell(0, 5, 'History Of Present Illness:', 0, 1);
	$pdf->SetFont('Arial','',10);
	$pdf->Cell(0, 5, $patient['history'], 0, 1);
}

/***************************************************************************************************
 * Review of Systems
 **************************************************************************************************/
if(count($reviewOfSystems) > 0) {
	$pdf->SetY($pdf->GetY() + 4);
	$pdf->SetFont('Arial', 'B', 10);
	$pdf->Cell(0, 5, 'Review of Systems:', 0, 1);
	foreach($reviewOfSystems as $review) {
		$pdf->SetFont('Arial', 'U', 10);
		$pdf->Cell(0, 5, strtoupper($review['particulars']) . ':', 0, 1);
		$pdf->SetFont('Arial', '', 8);
		$pdf->Cell(0, 5, $review['comment'], 0, 1);
		$pdf->SetY($pdf->GetY() + 1);
	}
}

/***************************************************************************************************
 * Current Medical Problem
 **************************************************************************************************/
if(count($currentProblem) > 0) {
	$pdf->SetY($pdf->GetY() + 4);
	$pdf->SetFont('Arial', 'B', 10);
	$pdf->Cell(0, 5, 'Current Medical Problem:', 0, 1);

	// Heading
	$pdf->SetFont('Arial','BU', 10);
	$pdf->Cell(50, 5, 'Description');
	$pdf->Cell(50, 5, 'Onset Date', 0, 1);
	$pdf->SetFont('Arial', '', 10);

	foreach($currentProblem as $problem) {
		$pdf->Cell(50, 5, $problem['description']);
		$pdf->Cell(0, 5, $problem['onset_date'], 0, 1);
		$pdf->SetY($pdf->GetY() + 1);
	}
}

/***************************************************************************************************
 * Other Medical Problem
 **************************************************************************************************/
if(count($otherProblem) > 0) {
	$pdf->SetY($pdf->GetY() + 4);
	$pdf->SetFont('Arial', 'B', 10);
	$pdf->Cell(0, 5, 'Other Medical Problem:', 0, 1);

	// Heading
	$pdf->SetFont('Arial','BU', 10);
	$pdf->Cell(50, 5, 'Description');
	$pdf->Cell(50, 5, 'Onset Date');
	$pdf->Cell(50, 5, 'Resolution Date', 0, 1);
	$pdf->SetFont('Arial', '', 10);

	foreach($otherProblem as $problem) {
		$pdf->Cell(50, 5, $problem['description']);
		$pdf->Cell(50, 5, $problem['onset_date']);
		$pdf->Cell(0, 5, $problem['resolution_date'], 0, 1);
		$pdf->SetY($pdf->GetY() + 1);
	}
}

/***************************************************************************************************
 * Past Surgical History
 **************************************************************************************************/
if(count($pastProblem) > 0) {
	$pdf->SetY($pdf->GetY() + 4);
	$pdf->SetFont('Arial', 'B', 10);
	$pdf->Cell(0, 5, 'Past Surgical History:', 0, 1);

	// Heading
	$pdf->SetFont('Arial','BU', 10);
	$pdf->Cell(50, 5, 'Description');
	$pdf->Cell(50, 5, 'Resolution Date', 0, 1);
	$pdf->SetFont('Arial', '', 10);

	foreach($pastProblem as $problem) {
		$pdf->Cell(50, 5, $problem['description']);
		$pdf->Cell(0, 5, $problem['resolution_date'], 0, 1);
		$pdf->SetY($pdf->GetY() + 1);
	}
}

/***************************************************************************************************
 * Medications
 **************************************************************************************************/
if(count($medication) > 0) {
	$pdf->SetY($pdf->GetY() + 4);
	$pdf->SetFont('Arial', 'B', 10);
	$pdf->Cell(0, 5, 'Current Medications:', 0, 1);
	$pdf->SetFont('Arial', '', 8);

	foreach($medication as $med) {
		$pdf->Cell(0, 5, 'Medicine: ' . $med['medicine'] . ', Strength: ' . $med['strength'] . ', Quantity: ' . $med['quantity'] . ', Sigs: ' . $med['sigs'], 0, 1);
		$pdf->SetY($pdf->GetY() + 1);
	}
}

/***************************************************************************************************
 * Allergies Intolerance
 **************************************************************************************************/
if(count($allergies) > 0) {
	$pdf->SetY($pdf->GetY() + 4);
	$pdf->SetFont('Arial', 'B', 10);
	$pdf->Cell(0, 5, 'Allergies:', 0, 1);

	// Heading
	$pdf->SetFont('Arial','BU', 10);
	$pdf->Cell(50, 5, 'Type');
	$pdf->Cell(50, 5, 'Status');
	$pdf->Cell(50, 5, 'Details', 0, 1);
	$pdf->SetFont('Arial', '', 10);

	foreach($allergies as $allergy) {
		$pdf->Cell(50, 5, $allergy['type']);
		$pdf->Cell(50, 5, $allergy['status']);
		$pdf->Cell(0, 5, $allergy['details'], 0, 1);
		$pdf->SetY($pdf->GetY() + 1);
	}
}

/***************************************************************************************************
 * Vital Signs
 **************************************************************************************************/
if($vitalSigns != null) {
	$pdf->SetY($pdf->GetY() + 4);
	$pdf->SetFont('Arial', 'B', 10);
	$pdf->Cell(0, 5, 'Vital Signs:', 0, 1);

	$heightType = '';
	if($vitalSigns['height_type'] == 1)
		$heightType = 'in';
	else
		$heightType = 'cm';
	$weightType = '';
	if($vitalSigns['weight_type'] == 1)
		$weightType = 'lb';
	else
		$weightType = 'kg';
	$pdf->SetFont('Arial', 'BU', 10);
	$pdf->Cell(30, 5, 'Height');
	$pdf->Cell(30, 5, 'Weight');
	$pdf->Cell(30, 5, 'Temp');
	$pdf->Cell(30, 5, 'BP Sitting');
	$pdf->Cell(30, 5, 'Pulse Sitting');
	$pdf->Cell(0, 5, 'BP Standing', 0, 1);
	$pdf->SetFont('Arial', '', 10);
	$pdf->Cell(30, 5, $vitalSigns['height'] . ' ' . $heightType);
	$pdf->Cell(30, 5, $vitalSigns['weight'] . ' ' . $weightType);
	$pdf->Cell(30, 5, $vitalSigns['temp'] . ' ' . $vitalSigns['temp_type']);
	$pdf->Cell(30, 5, $vitalSigns['sitting_blood_pressure']);
	$pdf->Cell(30, 5, $vitalSigns['sitting_pulse']);
	$pdf->Cell(0, 5, $vitalSigns['standing_blood_pressure'], 0, 1);
	$pdf->SetY($pdf->GetY() + 3);

	$bmi = '';
	$bsa = '';
	$height = $vitalSigns['height'];
	$weight = $vitalSigns['weight'];
	if($height != '' && $weight != '' && $height != 0 && $weight != 0) {
		if($heightType == 'in')
			$height = $height * 2.54;
		if($weightType == 'lb')
			$weight = $weight * 0.453592;
		$bmi = round(($weight / (($height/100) * ($height/100))), 2);
		$bsa = round((0.007184 * pow($weight, 0.425) * pow($height, 0.725)), 2);
	}
	else {
		$bmi = 'n/a';
		$bsa = 'n/a';
	}

	$pdf->SetFont('Arial', 'BU', 10);
	$pdf->Cell(30, 5, 'Pulse Standing');
	$pdf->Cell(30, 5, 'BP Lying');
	$pdf->Cell(30, 5, 'Pulse Lying');
	$pdf->Cell(30, 5, 'HC');
	$pdf->Cell(30, 5, 'BMI');
	$pdf->Cell(0, 5, 'BSA', 0, 1);
	$pdf->SetFont('Arial', '', 10);
	$pdf->Cell(30, 5, $vitalSigns['standing_pulse']);
	$pdf->Cell(30, 5, $vitalSigns['lying_blood_pressure']);
	$pdf->Cell(30, 5, $vitalSigns['lying_pulse']);
	$pdf->Cell(30, 5, $vitalSigns['hc']);
	$pdf->Cell(30, 5, $bmi);
	$pdf->Cell(0, 5, $bsa, 0, 1);
	$pdf->SetY($pdf->GetY() + 3);

	$pdf->SetFont('Arial', 'BU', 10);
	$pdf->Cell(30, 5, 'RESP');
	$pdf->Cell(0, 5, 'SpO2', 0, 1);
	$pdf->SetFont('Arial', '', 10);
	$pdf->Cell(30, 5, $vitalSigns['resp']);
	$pdf->Cell(0, 5, $vitalSigns['spo2'] . '%', 0, 1);
}

/***************************************************************************************************
 * Physical Examinations
 **************************************************************************************************/
if($abd != null || $cvs != null || $cw != null || $ent != null || $ext != null || $eye != null ||
	$gen != null || $heme != null || $lungs != null || $neuro != null || $skin != null || $followup != null) {
	$pdf->SetY($pdf->GetY() + 4);
	$pdf->SetFont('Arial', 'B', 10);
	$pdf->Cell(0, 5, 'Physical Examinations:', 0, 1);
	$pdf->SetFont('Arial', '', 8);
	
	if($gen != null && $gen['type'] != 1) {
		$pdf->Cell(0, 5, 'GEN:', 0, 1);
		$pdf->Cell(0, 5, 'NUTRITION: ' . $gen['nutrition'] . ', ' . 'HEAD: ' . $gen['head'], 0, 1);
		$pdf->SetY($pdf->GetY() + 2);
	}
	if($eye != null && $eye['type'] != 1) {
		$pdf->Cell(0, 5, 'EYE:', 0, 1);
		$pdf->Cell(0, 5, 'PERLA: ' . $eye['perla'] . ', ' . 'EOMI: ' . $eye['eomi'] . ', ' . 'ICTERUS: ' . $eye['icterus'] . ', ' . 'PALLOR: ' . $eye['pallor'], 0, 1);
		$pdf->SetY($pdf->GetY() + 2);
	}
	if($ent != null && $ent['type'] != 1) {
		$pdf->Cell(0, 5, 'ENT:', 0, 1);
		$pdf->Cell(0, 5, 'ORAL LESIONS: ' . $ent['oral_lesions'] . ', ' . 'NECK_RIGIDITY: ' . $ent['neck_rigidity'] . ', ' . 'CAROTID BRUITS: ' . $ent['carotid_bruits'] . ', ' . 'THYROMEGALY: ' . $ent['thyromegaly'] . ', ' . 'MM: ' . $ent['mm'] . ', ' . 'JVD: ' . $ent['jvd'], 0, 1);
		$pdf->Cell(0, 5, 'TM: ' . $ent['tm'] . ', ' . 'EAR CANAL: ' . $ent['ear_canal'] . ', ' . 'LEFT EAR: ' . $ent['left_ear'] . ', ' . 'RIGHT EAR: ' . $ent['right_ear'] . ', ' . 'NOSE: ' . $ent['nose'] . ', ' . 'THROAT: ' . $ent['throat'], 0, 1);
		$pdf->SetY($pdf->GetY() + 2);
	}
	if($cw != null && $cw['type'] != 1) {
		$pdf->Cell(0, 5, 'CW:', 0, 1);
		$pdf->Cell(0, 5, 'ASYMMETRY: ' . $cw['asymmetry'] . ', ' . 'CHEST/BREAST MASS: ' . $cw['chest'] . ', ' . 'SCAR: ' . $cw['scar'], 0, 1);
		$pdf->SetY($pdf->GetY() + 2);
	}
	if($lungs != null && $lungs['type'] != 1) {
		$pdf->Cell(0, 5, 'LUNGS:', 0, 1);
		$pdf->Cell(0, 5, 'CTAP: ' . $lungs['ctap'], 0, 1);
		$pdf->SetY($pdf->GetY() + 2);
	}
	if($cvs != null && $cvs['type'] != 1) {
		$pdf->Cell(0, 5, 'CVS:', 0, 1);
		$pdf->Cell(0, 5, 'RHYTHM: ' . $cvs['rhythm'] . ', ' . 'MURMUR: ' . $cvs['murmur'] . ', ' . 'GALLOP: ' . $cvs['gallop'] . ', ' . 'RUB: ' . $cvs['rub'], 0, 1);
		$pdf->SetY($pdf->GetY() + 2);
	}
	if($abd != null && $abd['type'] != 1) {
		$pdf->Cell(0, 5, 'ABD:', 0, 1);
		$pdf->Cell(0, 5, 'INSPECTION: ' . $abd['inspection'] . ', ' . 'PALPATION: ' . $abd['palpation'] . ', ' . 'PERCUSSION: ' . $abd['percussion'] . ', ' . 'AUSCULTATION: ' . $abd['auscultation'], 0, 1);
		$pdf->SetY($pdf->GetY() + 2);
	}
	if($ext != null && $ext['type'] != 1) {
		$pdf->Cell(0, 5, 'EXT:', 0, 1);
		$pdf->Cell(0, 5, 'CLUBBING: ' . $ext['clubbing'] . ', ' . 'CYANOSIS: ' . $ext['cyanosis'] . ', ' . 'EDEMA: ' . $ext['edema'] . ', ' . 'JOINTS: ' . $ext['joints'] . ', ' . 'SKELETON TENDERNESS: ' . $ext['skeleton_tenderness'], 0, 1);
		$pdf->SetY($pdf->GetY() + 2);
	}
	if($heme != null && $heme['type'] != 1) {
		$pdf->Cell(0, 5, 'HEME:', 0, 1);
		$pdf->Cell(0, 5, 'CERVICAL: ' . $heme['cervical'] . ', ' . 'AXILLARY: ' . $heme['axillary'] . ', ' . 'INGUINAL: ' . $heme['inguinal'], 0, 1);
		$pdf->SetY($pdf->GetY() + 2);
	}
	if($skin != null && $skin['type'] != 1) {
		$pdf->Cell(0, 5, 'SKIN:', 0, 1);
		$pdf->Cell(0, 5, 'ECCHYMOSES: ' . $skin['ecchymoses'] . ', ' . 'PATECHIAE: ' . $skin['patechiae'] . ', ' . 'RASH: ' . $skin['rash'], 0, 1);
		$pdf->SetY($pdf->GetY() + 2);
	}
	if($neuro != null && $neuro['type'] != 1) {
		$pdf->Cell(0, 5, 'NEURO:', 0, 1);
		if($neuro['focus'] == 1)
			$pdf->Cell(0, 5, 'Exams: Non Focal and Limited', 0, 1);
		else if($neuro['focus'] == 2)
			$pdf->Cell(0, 5, 'Exams: Comprehensive, CRANIAL NERVES: ' . $neuro['cranial_nerves'] . ', ' . 'MOTOR MUSCLE POWER: ' . $neuro['motor_muscle_power'] . ', ' . 'DTR: ' . $neuro['dtr'] . ', ' . 'SENSORY DEFICITS: ' . $neuro['sensory_deficits'] . ', ' . 'GAIT: ' . $neuro['gait'], 0, 1);
	}
}

/***************************************************************************************************
 * Labs/X-Ray/Pathology/Others
 **************************************************************************************************/
if(count($reports) > 0) {
	$pdf->SetY($pdf->GetY() + 4);
	$pdf->SetFont('Arial', 'B', 10);
	$pdf->Cell(0, 5, 'Labs/X-Ray/Pathology/Others:', 0, 1);

	// Heading
	$pdf->SetFont('Arial','BU', 10);
	$pdf->Cell(50, 5, 'Test Date');
	$pdf->Cell(50, 5, 'Type');
	$pdf->Cell(50, 5, 'Comments', 0, 1);
	$pdf->SetFont('Arial', '', 10);

	foreach($reports as $report) {
		$pdf->Cell(50, 5, $report['date']);
		$pdf->Cell(50, 5, $report['type']);
		$pdf->Cell(0, 5, $report['comment'], 0, 1);
		$pdf->SetY($pdf->GetY() + 1);
	}
}

/***************************************************************************************************
 * Diagnosis
 **************************************************************************************************/
if(count($diagnosis) > 0) {
	$pdf->SetY($pdf->GetY() + 4);
	$pdf->SetFont('Arial', 'B', 10);
	$pdf->Cell(0, 5, 'Diagnosis:', 0, 1);

	// Heading
	$pdf->SetFont('Arial','BU', 10);
	$pdf->Cell(50, 5, 'Diagnosis');
	$pdf->Cell(50, 5, 'Code', 0, 1);
	$pdf->SetFont('Arial', '', 10);

	foreach($diagnosis as $diagnose) {
		$pdf->Cell(50, 5, $diagnose['diagnosis']);
		$pdf->Cell(0, 5, $diagnose['code'], 0, 1);
		$pdf->SetY($pdf->GetY() + 1);
	}
}

/***************************************************************************************************
 * Instructions/Plan/Discussions
 **************************************************************************************************/
if($patient['plan_and_instructions'] != '') {
	$pdf->SetY($pdf->GetY() + 4);
	$pdf->SetFont('Arial', 'B', 10);
	$pdf->Cell(0, 5, 'Instructions/Plan/Discussions:', 0, 1);
	$pdf->SetFont('Arial', '', 10);
	$pdf->Cell(0, 5, $patient['plan_and_instructions'], 0, 1);
}

/***************************************************************************************************
 * Follow Up
 **************************************************************************************************/
if($followup != null) {
	$pdf->SetY($pdf->GetY() + 4);
	$pdf->SetFont('Arial', 'B', 10);
	$pdf->Cell(0, 5, 'Follow Up:', 0, 1);
	$pdf->SetFont('Arial', '', 10);
	switch($followup['type']) {
		case 1:
			$pdf->Cell(0, 5, 'Follow up in ' . $followup['value'] . ' ' . $followup['unit'], 0, 1);
			$pdf->Cell(0, 5, 'Comments: ' . $followup['comment'], 0, 1);
			break;
		case 2:
			$pdf->Cell(0, 5, 'Follow up after ' . $followup['comment'], 0, 1);
			break;
		case 3:
			$pdf->Cell(0, 5, 'Follow up PRN', 0, 1);
			$pdf->Cell(0, 5, 'Comments: ' . $followup['comment'], 0, 1);
			break;
		case 4:
			$pdf->Cell(0, 5, 'No follow up', 0, 1);
			$pdf->Cell(0, 5, 'Comments: ' . $followup['comment'], 0, 1);
			break;
	}
}
  
/***************************************************************************************************
 * Output PDF
 **************************************************************************************************/
$pdf->output();