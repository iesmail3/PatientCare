<?php
/**************************************************************************************************
 * File: insuranceHistory.php
 * Author: Imran Esmail
 * Description: This script creates a pdf containing information for the insurance
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
$startDate          = $_GET['startDate'];
$endDate          	= $_GET['endDate'];
$printAll         	= $_GET['printAll'];

class PDF extends FPDI_CellFit {

	function Header() {
 		$practiceId         = $_GET['practiceId'];
		$patientId			= $_GET['patientId'];
		$startDate          = $_GET['startDate'];
		$endDate          	= $_GET['endDate'];
		$printAll         	= $_GET['printAll'];
		$patient  			= array();
		$insurance  		= array();
		/******************************************************************************************
 		 * Get needed data from database
 		 *****************************************************************************************/
		  try {
 		 	// Connection script
 		 	require('connect_to_mysql.php');
			
			//Patient
			$stmt = $db->query("SELECT patient.* FROM patient WHERE 
								patient.id='$patientId'");
			$stmt->setFetchMode(PDO::FETCH_ASSOC);
			while($row = $stmt->fetch())
				$patient = $row;
			
		 }
		 catch (PDOException $e) {
			echo $e->getMessage() . "<br>";
		 }
		 
		 /******************************************************************************************
 		 * Clinic Info - Only on first page.
 		*****************************************************************************************/
		if($this->PageNo() == 1) {
			$this->SetFont('Arial', '', 12);
			$this->Cell(12,9, date('n/j/Y'),0,0,'L');
			$this->SetFont('Arial', 'B', 12);
			$this->Cell(0,9, 'INSURANCE HISTORY REPORT', 0, 1, 'C');
			 $y = $this->GetY() + 2;
			$this->Line(11, $y, 298, $y);
		}
		$y = $this->GetY() + 5;
		$this->SetFont('Arial', '', 10);
		$this->Cell(196, $y-7, 'Patient Name: ' . $patient['first_name'] . ' ' . 
 		                $patient['last_name']);
	    
		$this->Cell(0,$y-7, 'DOB: ' . $patient['date_of_birth'] . ' , ' . 'ID Number: ' .
 		                $patient['id_number'] . 'ID Type: ' .
 		                $patient['id_type'],0,1);
		$this->Cell(196,1,'Address: ' . $patient['address']);
		$this->Cell(0,1,'Marital Status: ' . $patient['marital_status'],0,1);
		$this->Cell(196,6,'City: ' . $patient['city'] . ' , ' . 'State: ' .
 		                $patient['state'] . ' , ' . 'Zip: ' .
 		                $patient['zip']);
		$this->Cell(0,6,'Is Employed?: ',0,1);
		$this->Cell(0,8,'Phone: ' . $patient['phone'] . ' , ' . 'Cell: ' . $patient['mobile'],0,1);
		 $y = $this->GetY() + 2;
		$this->Line(11, $y, 298, $y);
	}
	function Footer() {
		// Position at 1.5 cm from bottom
		$this->SetY(-15);
		// Arial italic 8
		$this->SetFont('Arial','',8);
		// Page number
		$this->Cell(0,10,'Page '.$this->PageNo().' of {nb}',0,0,'C');
    }
}
/***************************************************************************************************
 * Setup PDF
 **************************************************************************************************/
$pdf = new PDF('L','mm',array(200,300));
$pdf->AliasNbPages();
$pdf->AddPage();


$pdf->Cell(25,9,'Archive date');
$pdf->Cell(15,9,'Type');
$pdf->Cell(25,9,'Effective date');
$pdf->Cell(25,9,'Insured person'); 
$pdf->Cell(30,9,'Insured company');
$pdf->Cell(25,9,'Pre-ex clause');
$pdf->Cell(15,9,'Ref q?');
$pdf->Cell(15,9,'Plan');
$pdf->Cell(15,9,'Group');
$pdf->Cell(20,9,'Deductible');
$pdf->Cell(29,9,'Remaining OOP');
$pdf->Cell(27,9,'Patient Portion');
$pdf->Cell(100,9,'Co-pay',0,1);


if($printAll=='true') {
	//Insurance
	$stmt = $db->query("SELECT insurance.* FROM insurance");
	$stmt->setFetchMode(PDO::FETCH_ASSOC);
	$rows = $stmt->fetchAll();
	$insurance = $rows;
	foreach($insurance as $i) {
		$pdf->Cell(25,9,$i['archive_date']);
		$pdf->Cell(15,9,$i['type']);
		$pdf->Cell(25,9,$i['effective_date'],0,0,'R');
		$pdf->Cell(25,9,$i['contact_name'],0,0,'C'); 
		$pdf->Cell(30,9,$i['company_name'],0,0,'C');
		$pdf->Cell(25,9,$i['existing_clause'],0,0,'C');
		$pdf->Cell(15,9,$i['referral_required'],0,0,'C');
		$pdf->Cell(15,9,$i['plan'],0,0,'C');
		$pdf->Cell(15,9,$i['group_number'],0,0,'C');
		$pdf->Cell(20,9,$i['deductible'],0,0,'C');
		$pdf->Cell(29,9,$i['remaining_out_of_pocket'],0,0,'C');
		$pdf->Cell(27,9,$i['patient_portion'],0,0,'C');
		$pdf->Cell(100,9,$i['copayment'],0,1,'C');
	}
}
else {
	//Insurance
	$stmt = $db->query("SELECT insurance.* FROM insurance WHERE 
						effective_date  BETWEEN '$startDate' AND'$endDate'");
	$stmt->setFetchMode(PDO::FETCH_ASSOC);
	$rows = $stmt->fetchAll();
	$insurance = $rows;
	foreach($insurance as $i) {
		$pdf->Cell(25,9,$i['archive_date']);
		$pdf->Cell(15,9,$i['type']);
		$pdf->Cell(25,9,$i['effective_date'],0,0,'R');
		$pdf->Cell(25,9,$i['contact_name'],0,0,'C'); 
		$pdf->Cell(30,9,$i['company_name'],0,0,'C');
		$pdf->Cell(25,9,$i['existing_clause'],0,0,'C');
		$pdf->Cell(15,9,$i['referral_required'],0,0,'C');
		$pdf->Cell(15,9,$i['plan'],0,0,'C');
		$pdf->Cell(15,9,$i['group_number'],0,0,'C');
		$pdf->Cell(20,9,$i['deductible'],0,0,'C');
		$pdf->Cell(29,9,$i['remaining_out_of_pocket'],0,0,'C');
		$pdf->Cell(27,9,$i['patient_portion'],0,0,'C');
		$pdf->Cell(100,9,$i['copayment'],0,1,'C');
	}
}


 

/***************************************************************************************************
 * Output PDF
 **************************************************************************************************/
$pdf->output();
		