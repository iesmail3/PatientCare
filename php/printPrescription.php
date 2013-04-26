<?php
/**************************************************************************************************
 * File: printPrescription.php
 * Author: Imran Esmail
 * Description: This script creates a pdf containing information for the Prescritions
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
$medicationOrderId  = $_GET['medicationOrderId'];

class PDF extends FPDI_CellFit {
	
	function Header() {
 		$practiceId         = $_GET['practiceId'];
		$patientId			= $_GET['patientId'];
		$medicationOrderId  = $_GET['medicationOrderId'];
		$practice  			= array();
		$physician 		 	= array();
	    $patient  			= array();
		$allergies  		= array();
		$prescription  	    = array();
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
			$stmt = $db->query("SELECT physician.*
 			                    FROM prescription,medication_order,physician,service_record 
								WHERE  medication_order.id = '$medicationOrderId' AND 
								medication_order.service_record_id = service_record.id AND
								service_record.physician_id = physician.id");
			$stmt->setFetchMode(PDO::FETCH_ASSOC);
			$rows = $stmt->fetchAll();
			$physician = $rows[0];
				
			//Patient
			$stmt = $db->query("SELECT patient.* FROM patient WHERE id='$patientId'");
			$stmt->setFetchMode(PDO::FETCH_ASSOC);
			$rows = $stmt->fetchAll();
			$patient = $rows[0];
			
			//Allergies/Intolerances 
			$stmt = $db->query("SELECT type,details FROM allergies_intolerance,medication_order,
								service_record,prescription WHERE medication_order.id = '$medicationOrderId' AND medication_order.service_record_id=
								service_record.id AND service_record.id=allergies_intolerance.service_record_id");
			$stmt->setFetchMode(PDO::FETCH_ASSOC);
			$rows = $stmt->fetchAll();
			$allergies = $rows;
			
			//Prescription 
			$stmt = $db->query("SELECT prescription.* FROM prescription WHERE medication_order_id='$medicationOrderId'");
			$stmt->setFetchMode(PDO::FETCH_ASSOC);
			while($row = $stmt->fetch())
				$prescription = $row;
			
			
		}
		catch (PDOException $e) {
			echo $e->getMessage() . "<br>";
		}
		
		/******************************************************************************************
 		 * Clinic Info - Only on first page.
 		 *****************************************************************************************/
		if($this->PageNo() == 1) {
			$this->SetFont('Arial', 'B', 14);
			$this->Cell(0, 9, 'Prescription', 0, 2, 'C');
			$this->SetFont('Arial', 'B', 12);
			$this->SetX(10);
			$this->Cell(0,11,$practice['name'], 0, 1);
			$this->SetFont('Arial', '', 11);
			$y = $this->GetY();
			$this->SetY($y - 11);
			$this->Cell(0, 11, date('n/j/Y'), 0, 1, 'R');
		}
		
		/******************************************************************************************
 		 * Physician Information
 		 *****************************************************************************************/
		$this->SetFont('Arial', 'B', 12);
		$this->Cell(0, 11, $physician['first_name'] . ' ' . $physician['last_name'] . 
					', ' . $physician['degree'], 0, 1);
			$this->SetFont('Arial', '', 11);
			$this->SetX(10);
			$this->Cell(0,4, $practice['address'] . ', ' . $practice['city'] . ', '
					    . $practice['state'] . '-' . $practice['zip'], 0, 1);
			$this->SetX(10);
			$this->Cell(0,4, 'Phone: ' . $practice['phone'] . ', Fax: ' 
						. $practice['fax'], 0, 1);
		$this->CellFit(0, 4, 'License No: ' . $physician['license'] . ', NPI: ' . 
				       $physician['npi'] . ', DEA: ' . $physician['dea'], 0, 1);
		if($this->PageNo() == 1)
			$this->Line(11, 60, 199, 60);
		// else
			// $this->Line(11, 27, 199, 27);
		
		/******************************************************************************************
 		 * Patient Information
 		 *****************************************************************************************/
 		 $dob = date($patient['date_of_birth']);
 		 if($this->PageNo() == 1)
		 	$this->SetY(62);
		 else
		 	$this->SetY(28);
 		 $this->CellFit(0, 8, 'Patient Name: ' . $patient['first_name'] . ' ' . 
 		                $patient['middle_name'] . ' ' . $patient['last_name'] . ', DOB: ' .
 		                 $dob . ', Age: ' . $this->dobToAge($dob) . ', Gender: ' . 
 		                 ucfirst($patient['gender']), 0, 1);
		
		/******************************************************************************************
 		 * Allergy Information
 		 *****************************************************************************************/
		 $this->SetFont('Arial', 'U', 11);
		 $this->Cell(0,4,'Allergies and Intolerance', 0, 1);
		 $this->SetFont('Arial', '', 11);
		 // Data
		foreach($allergies as $a) {
			 $this->Cell(0, 4, $a['details'] . ' ' . '[' . $a['type'] . ']',0,1,'L');
		}
		
		/******************************************************************************************
 		 * Prescription Information
 		 *****************************************************************************************/
		 $y = $this->GetY() + 5;
		 $this->SetY($y);
		 $this->SetFont('Arial', 'U', 11);
		 $this->Cell(0,4,'Prescriptions', 0, 1);
		  $this->SetFont('Arial', '', 11);
		 $this->Cell(0,4, $prescription['medicine'], 0, 1);
		 $this->CellFit(0, 4, 'Strength: ' . $prescription['strength'] . ', Dose: ' . 
				       $prescription['quantity'] . ', Sigs: ' . $prescription['sigs'] . ', Route: ' . 
				       $prescription['route'] . ', Dispense: ' . $prescription['dispensed_quantity'] . ', Refill: ' . $prescription['refill_quantity'], 0, 1);
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