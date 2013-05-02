<?php
/**************************************************************************************************
 * File: printLetter.php
 * Author: Imran Esmail
 * Description: This script creates a pdf containing diagnosis letter 
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

 $practiceId     = $_GET['practiceId'];
 $patientId      = $_GET['patientId'];
 $date           = $_GET['date'];
 
 class PDF extends FPDI_CellFit {
 
	function Header() {
		 $practiceId     = $_GET['practiceId'];
		 $patientId      = $_GET['patientId'];
		 $date           = $_GET['date'];
		 $practice  	 = array();
		 $physician 	 = array();
	     $patient  		 = array();
		 $letter         = array(); 
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
 			                    FROM  physician LEFT JOIN service_record ON physician.id = 
								service_record.physician_id WHERE service_record.patient_id='$patientId'  AND service_record.practice_id=  '$practiceId' AND service_record.date= '$date'
								");
			$stmt->setFetchMode(PDO::FETCH_ASSOC);
			while($row = $stmt->fetch())
				$physician = $row; 
		
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
		 $this->SetFont('Arial', '', 12);
		 $y = $this->GetY();
		 $this->SetY($y - 11);
		 $this->Cell(0, 11, date('n/j/Y'), 0, 1, 'R');
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
 * Pull Data from Database
 **************************************************************************************************/
 //Service Record 
$stmt = $db->query("SELECT * FROM service_record WHERE practice_id='$practiceId'
			AND patient_id='$patientId' AND date='$date'");
			$stmt->setFetchMode(PDO::FETCH_ASSOC);
			$result = $stmt->fetchAll();
			$result = $result[0];
			$letter = $result; 
/***************************************************************************************************
 * Setup PDF
 **************************************************************************************************/
$pdf = new PDF();
$pdf->AliasNbPages();
$pdf->AddPage();

$y = $pdf->GetY() + 3;
$pdf->SetY($y);
$pdf->MultiCell(200,8,$letter['diagnosis_letter'],0,1);


  
/***************************************************************************************************
 * Output PDF
 **************************************************************************************************/
$pdf->output();
  