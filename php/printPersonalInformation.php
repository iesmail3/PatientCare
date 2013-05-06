<?php
/**************************************************************************************************
 * File: printPersonalInformation.php
 * Author: Gary Chang
 * Description: This script creates a pdf containing information for the personal information view
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

class PDF extends FPDI_CellFit {
	
	function Header() {
 		$practiceId         = $_GET['practiceId'];
		$patientId			= $_GET['patientId'];
		$practice  			= array();
		$patient			= array();
		$spouse				= array();
		$employer			= array();
		$referringPhysician	= array();
		$pcp				= array();
		$other				= array();
		$primaryInsurance	= array();
		$secondaryInsurance	= array();
		$otherInsurance		= array();
		$guarantor			= array();
		/******************************************************************************************
 		 * Get needed data from database
 		 *****************************************************************************************/
		 try {
 		 	// Connection script
 		 	require('connect_to_mysql.php');
			
			//Practice
			$stmt = $db->query("SELECT * FROM practice WHERE id='$practiceId'");
			$stmt->setFetchMode(PDO::FETCH_ASSOC);
			while($row = $stmt->fetch())
				$practice = $row;
		}
		catch (PDOException $e) {
			echo $e->getMessage() . "<br>";
		}
		/******************************************************************************************
 		 * Clinic Info - Only on first page.
 		 *****************************************************************************************/
		if($this->PageNo() == 1) {
			$this->SetFont('Arial', 'B', 14);
			$this->Cell(0, 9, 'Personal Information', 0, 2, 'C');
			$this->SetFont('Arial', 'B', 12);
			$this->SetX(10);
			$this->Cell(0,11,$practice['name'] . ' Phone: ' . $practice['phone'] .
						' Fax: ' . $practice['fax'], 0, 1);
		}
	}
	// Print Footer
	function Footer() {
		// Position at 1.5 cm from bottom
		$this->SetY(-15);
		// Arial italic 8
		$this->SetFont('Arial','',8);
		// Page number
		$this->Cell(0,10,'Page '.$this->PageNo().' of {nb}',0,0,'C');
    }
	//Convert Date of Birth to Age
	function dobToAge($date) {
		$today = date('Y-m-d');
		$dif = abs(strtotime($today) - strtotime($date));
		$years = floor($dif / 365 / 60 / 60 / 24);
		return $years . ' yrs.';
	}
}

/******************************************************************************************
 * Grab data from database
 *****************************************************************************************/
//Patient
$stmt = $db->query("SELECT patient.* FROM patient WHERE id='$patientId'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
$patient = $rows[0];

//Spouse
$stmt = $db->query("SELECT spouse.* FROM spouse WHERE patient_id='$patientId' AND practice_id='$practiceId'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
if(count($rows) > 0)
	$spouse = $rows[0];
else
	$spouse = null;

//Employer
$stmt = $db->query("SELECT employer.* FROM employer WHERE patient_id='$patientId' AND practice_id='$practiceId'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
if(count($rows) > 0)
	$employer = $rows[0];
else
	$employer = null;

//Referring Physician
$stmt = $db->query("SELECT * FROM reference WHERE patient_id='$patientId' AND practice_id='$practiceId' AND type='referringphysician'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
if(count($rows) > 0)
	$referringPhysician = $rows[0];
else
	$referringPhysician = null;

//PCP
$stmt = $db->query("SELECT * FROM reference WHERE patient_id='$patientId' AND practice_id='$practiceId' AND type='pcp'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
if(count($rows) > 0)
	$pcp = $rows[0];
else
	$pcp = null;

//Other
$stmt = $db->query("SELECT * FROM reference WHERE patient_id='$patientId' AND practice_id='$practiceId' AND type='other'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
if(count($rows) > 0)
	$other = $rows[0];
else
	$other = null;

//Primary Insurance
$stmt = $db->query("SELECT insurance.* FROM insurance WHERE patient_id='$patientId' AND practice_id='$practiceId' AND type='primary'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
if(count($rows) > 0)
	$primaryInsurance = $rows[0];
else
	$primaryInsurance = null;

//Secondary Insurance
$stmt = $db->query("SELECT insurance.* FROM insurance WHERE patient_id='$patientId' AND practice_id='$practiceId' AND type='secondary'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
if(count($rows) > 0)
	$secondaryInsurance = $rows[0];
else
	$secondaryInsurance = null;

//Other Insurance
$stmt = $db->query("SELECT insurance.* FROM insurance WHERE patient_id='$patientId' AND practice_id='$practiceId' AND type='other'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
if(count($rows) > 0)
	$otherInsurance = $rows[0];
else
	$otherInsurance = null;

//Guarantor
$stmt = $db->query("SELECT guarantor.* FROM guarantor WHERE patient_id='$patientId' AND practice_id='$practiceId'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
if(count($rows) > 0)
	$guarantor = $rows[0];
else
	$guarantor = null;

/***************************************************************************************************
 * Setup PDF
 **************************************************************************************************/
$pdf = new PDF();
$pdf->AliasNbPages();
$pdf->AddPage();

/******************************************************************************************
 * Patient Information
 *****************************************************************************************/
$pdf->SetFont('Arial', 'B', 11);
$pdf->Cell(0, 8, 'Patient: ' . $patient['first_name'] . ' ' .
			$patient['middle_name'] . ' ' . $patient['last_name'], 0, 0);
$pdf->SetFont('Arial', '', 11);
$pdf->Cell(0, 8, date('n/j/Y'), 0, 1, 'R');
$dob = date($patient['date_of_birth']);
$pdf->CellFit(0, 5, 'Gender: ' . ucfirst($patient['gender']) . ', DOB: ' . $dob .
				', ID Number: ' . $patient['id_number'] .
				', ID Type: ' . $patient['id_type'], 0, 1);
$pdf->CellFit(0, 5, 'Phone: ' . $patient['phone'] . ', Mobile: ' . $patient['mobile'] .
				', Email: ' . $patient['email'], 0, 1);

/******************************************************************************************
 * Address & Spouse Information
 *****************************************************************************************/
$pdf->SetFont('Arial', 'B', 11);
$pdf->Cell(100, 8, 'Address:', 0, 0);
$pdf->CellFit(0, 8, 'Spouse Information: ' . ucfirst($patient['marital_status']) .
			', Children: ' . $patient['number_of_children'], 0, 1);
$pdf->SetFont('Arial', '', 11);
$dob = date($spouse['date_of_birth']);
$pdf->Cell(100, 5, $patient['country'], 0, 0);
$pdf->CellFit(0, 5, 'Spouse Name: ' . $spouse['first_name'] . ' ' . $spouse['last_name'], 0, 1);
$pdf->Cell(100, 5, $patient['address'], 0, 0);
$pdf->Cell(0, 5, 'Phone: ' . $spouse['phone'] . ' Work: ' . $spouse['work_phone'], 0, 1);
$pdf->CellFit(100, 5, $patient['city'] . ', ' . $patient['state'] . ' ' . $patient['zip'], 0, 0);
$pdf->CellFit(0, 5, 'ID Number: ' . $spouse['id_number'] . ', ID Type: ' . $spouse['id_type'] .
				', DOB: ' . $dob, 0, 1);

/******************************************************************************************
 * Emergency Information & Employer Information
 *****************************************************************************************/
$pdf->SetFont('Arial', 'B', 11);
$pdf->Cell(100, 8, 'Emergency Contact Information:', 0, 0);
$pdf->Cell(0, 8, 'Employer Information:', 0, 1);
$pdf->SetFont('Arial', '', 11);
$pdf->CellFit(100, 5, 'Emergency Contact: ' . $patient['contact_name'], 0, 0);
$pdf->CellFit(0, 5, 'Employer: ' . $employer['company_name'], 0, 1);
$pdf->CellFit(100, 5, 'Relationship: ' . $patient['contact_relationship'], 0, 0);
$pdf->CellFit(0, 5, 'Address: ' . $employer['address'], 0, 1);
$pdf->CellFit(100, 5, 'Phone: ' . $patient['contact_phone'] . ', Cell: ' . $patient['contact_mobile'], 0, 0);
$pdf->CellFit(0, 5, $employer['city'] . ', ' . $employer['state'] . ' ' . $employer['zip'], 0, 1);
$pdf->SetX(110);
$pdf->CellFit(0, 5, 'Phone: ' . $employer['phone'] . ' Ext: ' . $employer['phone_ext'], 0, 1);
$y = $pdf->GetY() + 3;
$pdf->Line(11, $y, 199, $y);

/******************************************************************************************
 * References
 *****************************************************************************************/
$y = $pdf->GetY() + 6;
$pdf->SetY($y);
if (count($referringPhysician) > 0) {
	$pdf->CellFit(0, 5, 'Referring Physician: ' . $referringPhysician['first_name'] . ' ' .
							$referringPhysician['middle_name'] . ' ' . $referringPhysician['last_name'] . ', ' .
							$referringPhysician['degree'], 0, 1);
				$pdf->CellFit(0, 5, 'Phone: ' . $referringPhysician['phone'] . ' Fax: ' .
								$referringPhysician['fax'], 0, 1);
}
if (count($pcp) > 0) {
	$pdf->CellFit(0, 5, 'PCP: ' . $pcp['first_name'] . ' ' .
							$pcp['middle_name'] . ' ' . $pcp['last_name'] . ', ' .
							$pcp['degree'], 0, 1);
				$pdf->CellFit(0, 5, 'Phone: ' . $pcp['phone'] . ' Fax: ' .
								$pcp['fax'], 0, 1);
}
if (count($other) > 0) {
	$pdf->CellFit(0, 5, 'Other: ' . $other['first_name'] . ' ' .
							$other['middle_name'] . ' ' . $other['last_name'] . ', ' .
							$other['degree'], 0, 1);
				$pdf->CellFit(0, 5, 'Phone: ' . $other['phone'] . ' Fax: ' .
								$other['fax'], 0, 1);
	$y = $pdf->GetY() + 6;
}
$y = $pdf->GetY() + 3;
$pdf->Line(11, $y, 199, $y);

/******************************************************************************************
 * Primary Insurance
 *****************************************************************************************/
$y = $pdf->GetY() + 6;
$pdf->SetY($y);
$effectiveDate = date($primaryInsurance['effective_date']);
$verificationDate = date($primaryInsurance['verification_date']);
$pdf->SetFont('Arial', 'B', 11);
$pdf->Cell(0, 8, 'Primary Insurance:', 0, 1);
$pdf->SetFont('Arial', '', 11);
$pdf->Cell(0, 5, 'Name: ' . $primaryInsurance['company_name'], 0, 1);
$pdf->Cell(0, 5, 'Plan: ' . $primaryInsurance['plan'], 0, 1);
$pdf->Cell(0, 5, 'Insurance ID Number: ' . $primaryInsurance['policy_number'], 0, 1);
$pdf->Cell(0, 5, 'Group: ' . $primaryInsurance['group_number'], 0, 1);
$pdf->Cell(0, 5, 'Effective Date: ' . $effectiveDate, 0, 1);
if (count($guarantor) > 0) {
	$dob = date($guarantor['date_of_birth']);
	$pdf->CellFit(0, 5, 'Insured Person: ' . $guarantor['name'] .
					', ID Number: ' . $guarantor['id_number'] .
					', ID Type: ' . $guarantor['id_type'] .
					', DOB: ' . $dob . ', Relationship: ' . $guarantor['relationship'] .
					', Employer: ' . $guarantor['employer'] .
					', Phone: ' . $guarantor['employer_phone'], 0, 1);
}
$preExistingClause = '';
if($primaryInsurance['existing_clause'])
	$preExistingClause = 'Yes';
else if(!$primaryInsurance['existing_clause'])
	$preExistingClause = 'No';
$pdf->Cell(0, 5, 'Pre-Existing Clause: ' . $preExistingClause, 0, 1);
$referralRequired = '';
if($primaryInsurance['referral_required'])
	$referralRequired = 'Yes';
else if(!$primaryInsurance['referral_required'])
	$referralRequired = 'No';
$pdf->Cell(0, 5, 'Referral Required: ' . $referralRequired, 0, 1);
$pdf->Cell(0, 5, 'Deductible: $' . $primaryInsurance['deductible'], 0, 1);
$pdf->Cell(0, 5, 'Remaining Ded: $' . $primaryInsurance['remaining_deductible'], 0, 1);
$pdf->Cell(0, 5, 'Out of Pocket: $' . $primaryInsurance['out_of_pocket'], 0, 1);
$pdf->Cell(0, 5, 'Remaining OOP: $' . $primaryInsurance['remaining_out_of_pocket'], 0, 1);
$pdf->Cell(0, 5, 'OV/Lab Copay: $' . $primaryInsurance['copayment'], 0, 1);
$pdf->Cell(0, 5, 'Patient Portion: ' . $primaryInsurance['patient_portion'] . '%', 0, 1);
$pdf->Cell(0, 5, 'Insurance Contact Name: ' . $primaryInsurance['contact_name'], 0, 1);
$pdf->Cell(0, 5, 'Phone for Verification: ' . $primaryInsurance['contact_phone'], 0, 1);
$pdf->Cell(0, 5, 'Verification Date: ' . $verificationDate . ' ' . $primaryInsurance['verification_time'], 0, 1);
$pdf->Cell(0, 5, 'Confirmation Number: ' . $primaryInsurance['confirmation_number'], 0, 1);

/******************************************************************************************
 * Secondary Insurance
 *****************************************************************************************/

$pdf->SetY($y);
$pdf->SetX(90);
$effectiveDate = date($secondaryInsurance['effective_date']);
$verificationDate = date($secondaryInsurance['verification_date']);
$pdf->SetFont('Arial', 'B', 11);
$pdf->Cell(0, 8, 'Secondary Insurance:', 0, 2);
$pdf->SetFont('Arial', '', 11);
$pdf->Cell(50, 5, 'Name: ' . $secondaryInsurance['company_name'], 0, 0);
$pdf->Cell(0, 5, 'Plan: ' . $secondaryInsurance['plan'], 0, 2);
$pdf->SetX(90);
$pdf->Cell(0, 5, 'Insurance ID Number: ' . $secondaryInsurance['policy_number'], 0, 2);
$pdf->Cell(0, 5, 'Group: ' . $secondaryInsurance['group_number'], 0, 2);
$pdf->Cell(0, 5, 'Effective Date: ' . $effectiveDate, 0, 2);
$preExistingClause = '';
if($secondaryInsurance['existing_clause'])
	$preExistingClause = 'Yes';
else if(!$secondaryInsurance['existing_clause'])
	$preExistingClause = 'No';
$pdf->Cell(50, 5, 'Pre-Existing Clause: ' . $preExistingClause, 0, 0);
$referralRequired = '';
if($secondaryInsurance['referral_required'])
	$referralRequired = 'Yes';
else if(!$secondaryInsurance['referral_required'])
	$referralRequired = 'No';
$pdf->Cell(0, 5, 'Referral Required: ' . $referralRequired, 0, 2);
$pdf->SetX(90);
$pdf->Cell(50, 5, 'Deductible: $' . $secondaryInsurance['deductible'], 0, 0);
$pdf->Cell(0, 5, 'Remaining Deducible: $' . $secondaryInsurance['remaining_deductible'], 0, 2);
$pdf->SetX(90);
$pdf->Cell(50, 5, 'Out of Pocket: $' . $secondaryInsurance['out_of_pocket'], 0, 0);
$pdf->Cell(0, 5, 'Remaining OOP: $' . $secondaryInsurance['remaining_out_of_pocket'], 0, 2);
$pdf->SetX(90);
$pdf->Cell(50, 5, 'OV/Lab Copay: $' . $secondaryInsurance['copayment'], 0, 0);
$pdf->Cell(0, 5, 'Patient Portion: ' . $secondaryInsurance['patient_portion'] . '%', 0, 2);
$pdf->SetX(90);
$pdf->Cell(0, 5, 'Insurance Contact Name: ' . $secondaryInsurance['contact_name'], 0, 2);
$pdf->Cell(0, 5, 'Phone for Verification: ' . $secondaryInsurance['contact_phone'], 0, 2);
$pdf->Cell(0, 5, 'Verification Date: ' . $verificationDate . ' ' . $secondaryInsurance['verification_time'], 0, 2);
$pdf->Cell(0, 5, 'Confirmation Number: ' . $secondaryInsurance['confirmation_number'], 0, 2);

 /******************************************************************************************
 * Other Insurance
 *****************************************************************************************/
$effectiveDate = date($otherInsurance['effective_date']);
$verificationDate = date($otherInsurance['verification_date']);
$pdf->SetFont('Arial', 'B', 11);
$pdf->Cell(0, 8, 'Other Insurance:', 0, 2);
$pdf->SetFont('Arial', '', 11);
$pdf->Cell(50, 5, 'Name: ' . $otherInsurance['company_name'], 0, 0);
$pdf->Cell(0, 5, 'Plan: ' . $otherInsurance['plan'], 0, 2);
$pdf->SetX(90);
$pdf->Cell(0, 5, 'Insurance ID Number: ' . $otherInsurance['policy_number'], 0, 2);
$pdf->Cell(0, 5, 'Group: ' . $otherInsurance['group_number'], 0, 2);
$pdf->Cell(0, 5, 'Effective Date: ' . $effectiveDate, 0, 2);
$preExistingClause = '';
if($otherInsurance['existing_clause'])
	$preExistingClause = 'Yes';
else if(!$otherInsurance['existing_clause'])
	$preExistingClause = 'No';
$pdf->Cell(50, 5, 'Pre-Existing Clause: ' . $preExistingClause, 0, 0);
$referralRequired = '';
if($otherInsurance['referral_required'])
	$referralRequired = 'Yes';
else if(!$otherInsurance['referral_required'])
	$referralRequired = 'No';
$pdf->Cell(0, 5, 'Referral Required: ' . $referralRequired, 0, 2);
$pdf->SetX(90);
$pdf->Cell(50, 5, 'Deductible: $' . $otherInsurance['deductible'], 0, 0);
$pdf->Cell(0, 5, 'Remaining Deducible: $' . $otherInsurance['remaining_deductible'], 0, 2);
$pdf->SetX(90);
$pdf->Cell(50, 5, 'Out of Pocket: $' . $otherInsurance['out_of_pocket'], 0, 0);
$pdf->Cell(0, 5, 'Remaining OOP: $' . $otherInsurance['remaining_out_of_pocket'], 0, 2);
$pdf->SetX(90);
$pdf->Cell(50, 5, 'OV/Lab Copay: $' . $otherInsurance['copayment'], 0, 0);
$pdf->Cell(0, 5, 'Patient Portion: ' . $otherInsurance['patient_portion'] . '%', 0, 2);
$pdf->SetX(90);
$pdf->Cell(0, 5, 'Insurance Contact Name: ' . $otherInsurance['contact_name'], 0, 2);
$pdf->Cell(0, 5, 'Phone for Verification: ' . $otherInsurance['contact_phone'], 0, 2);
$pdf->Cell(0, 5, 'Verification Date: ' . $verificationDate . ' ' . $otherInsurance['verification_time'], 0, 2);
$pdf->Cell(0, 5, 'Confirmation Number: ' . $otherInsurance['confirmation_number'], 0, 2);
 
/***************************************************************************************************
 * Output PDF
 **************************************************************************************************/
$pdf->output();