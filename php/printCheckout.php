<?php
/**************************************************************************************************
 * File: printCheckout.php
 * Author: Imran Esmail
 * Description: This script creates a pdf containing information for the Checkout
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
$checkoutId         = $_GET['checkoutId']; 
$primaryCo          = $_GET['primaryCo'];
$secondaryCo        = $_GET['secondaryCo'];
$otherCo            = $_GET['otherCo'];


class PDF extends FPDI_CellFit {

	function Header() {
 		$practiceId         = $_GET['practiceId'];
		$patientId			= $_GET['patientId'];
		$serviceRecordId    = $_GET['serviceRecordId'];
		$checkoutId         = $_GET['checkoutId'];
		$primaryCo          = $_GET['primaryCo'];
		$secondaryCo        = $_GET['secondaryCo'];
		$otherCo            = $_GET['otherCo'];
		$practice  			= array();
		$physician 		 	= array();
	    $patient  			= array();
		$paymentMethod      = array(); 
		$checkout           = array();
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
			
			 //Physician 
			$stmt = $db->query("SELECT physician.* FROM checkout,service_record,physician WHERE 
								service_record.id='$serviceRecordId' AND 
								service_record.physician_id=physician.id");
			$stmt->setFetchMode(PDO::FETCH_ASSOC);
			while($row = $stmt->fetch())
				$physician = $row;
			
			//Patient
			$stmt = $db->query("SELECT patient.* FROM patient WHERE 
								patient.id='$patientId'");
			$stmt->setFetchMode(PDO::FETCH_ASSOC);
			while($row = $stmt->fetch())
				$patient = $row;
			
			//Particulars
			$stmt = $db->query("SELECT mode,amount FROM payment_method WHERE 
								payment_method.checkout_id='$checkoutId'");
			$stmt->setFetchMode(PDO::FETCH_ASSOC);
		    $rows = $stmt->fetchAll();
				$paymentMethod = $rows;
			
			//Checkout
			$stmt = $db->query("SELECT *FROM checkout WHERE 
								id='$checkoutId'");
			$stmt->setFetchMode(PDO::FETCH_ASSOC);
		    while($row = $stmt->fetch())
				$checkout = $row;
	
		 }
		 catch (PDOException $e) {
			echo $e->getMessage() . "<br>";
		 }
		 
		 /******************************************************************************************
 		 * Physician Information
 		 *****************************************************************************************/
		 $this->SetFont('Arial', 'B', 12);
		 $this->Cell(0, 11, $physician['first_name'] . ' ' . $physician['last_name'] . 
					', ' . $physician['degree'], 0, 1);
		 
		 /******************************************************************************************
 		 * Clinic Info - Only on first page.
 		 *****************************************************************************************/
		 if($this->PageNo() == 1) {
		 $this->SetFont('Arial', '', 11);
		 $this->Cell(0,11,$practice['name'], 0, 1);
		 $this->Cell(0,4, $practice['address'] . ', ' . $practice['city'] . ', '
					. $practice['state'] . '-' . $practice['zip'], 0, 1);
		 $this->Cell(0,4, 'Phone: ' . $practice['phone'] . ', Fax: ' 
					. $practice['fax'], 0, 1);
		 }
		 
		 /******************************************************************************************
 		 * Physician Information
 		 *****************************************************************************************/
		$this->CellFit(0, 4, 'License No: ' . $physician['license'] . ', NPI: ' . 
				       $physician['npi'] . ', DEA: ' . $physician['dea'], 0, 1);
		if($this->PageNo() == 1)
			$this->Line(11, 45, 199, 45);
		
		/******************************************************************************************
 		 * Patient Information
 		 *****************************************************************************************/
 		 $dob = date($patient['date_of_birth']);
 		 $this->CellFit(0, 8, 'Patient Name: ' . $patient['first_name'] . ' ' . 
 		                $patient['middle_name'] . ' ' . $patient['last_name'] . ', DOB: ' .
 		                 $dob . ', Age: ' . $this->dobToAge($dob) . ', Gender: ' . 
 		                 ucfirst($patient['gender']), 0, 1);
		 $this->Line(11, 55, 199, 55);
		 
		 /******************************************************************************************
 		 *  Particulars and Amount
 		 *****************************************************************************************/
		 $y = $this->GetY() + 5;
		 //Headers
		 $this->SetY($y);
		 $this->Cell(65, 7, 'Particulars');
		 $this->Cell(30, 7, 'Amount');
		 $this->Cell(65, 7, 'Particulars');
		 $this->Cell(55, 7, 'Amount', 0, 1);
		 //Separator 
		 $this->Line(11, 65, 199, 65);
		 $y = $this->GetY() + 5;
		 $this->SetY($y);
		 $this->Cell(30,7,'Copayment'); 
		 $this->Cell(19,7,'Primary');
		 $this->Cell(50,7,'$'.$primaryCo,0,1);
		 $this->SetX(40);
		 $this->Cell(19,7,'Secondary'); 
		 $this->Cell(25,7,'$'.$secondaryCo, 0 ,1); 
		 $this->SetX(40);
		 $this->Cell(19,7,'Other'); 
		 $this->Cell(20,7,'$'. $otherCo);
		 $this->Cell(25,7,'$'.$checkout['copay_amount'],0,1); 
		 $y = $this->GetY();
		 $this->Line(40, $y, 70, $y);
		 $this->Cell(69,7,'Other-Copay');
		 $this->Cell(25,7,'$'. $checkout['other_copay'],0,1); 
		 $this->Cell(69,7,'Additional Charges');
		 $this->Cell(25,7,'$'. $checkout['additional_charges'],0,1); 
		 $this->Cell(69,7,'Insurance Portion');
		 $this->Cell(25,7,'$'. $checkout['insurance_portion'],0,1); 
		 $this->SetX(105); 
		  $this->SetFont('Arial', 'B', 11);
		 $this->Cell(65,7,'Balance');
		 $this->Cell(25,7,'$'. $checkout['balance'],0,1); 
		 $y = $this->GetY() + 3;
		 $this->SetY($y);
		 $this->Line(11, $y, 199, $y);
		 $this->SetX(79);
		 $this->SetFont('Arial', 'B', 11);
		 $this->Cell(95,7,'$'. $checkout['total_receivable'],0,1); 
		 
		 $this->SetFont('Arial', '', 11);
		 $y = $this->GetY() - 50;
		 $this->SetY($y);
		 // Data
		 foreach($paymentMethod as $p) {
		    $this->SetX(105);
			$this->Cell(65,7,$p['mode']); 
			$this->Cell(105,7,'$' . $p['amount'],0,1);
		 }
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
 * Setup PDF
 **************************************************************************************************/
$pdf = new PDF();
$pdf->AliasNbPages();
$pdf->AddPage();

  
/***************************************************************************************************
 * Output PDF
 **************************************************************************************************/
$pdf->output();