<?php
header("charset=utf-8");
/***************************************************************************************************
 * Includes
 **************************************************************************************************/
// Mysql
include('connect_to_mysql.php');
// FPDF
include_once('fpdf/fpdf.php');
include_once('fpdf/fpdi.php');
include_once('fpdf/cellfit.php');

/***************************************************************************************************
 * Main Object Variables
 **************************************************************************************************/
$practiceId         = $_GET['practiceId'];
$orderId            = $_GET['orderId'];
$serviceRecordId    = $_GET['serviceRecordId'];
$serviceRecord      = array();
$vitals             = array();
$drugOrders   		= array();
$diagnosis          = array();
$orders				= array();
$officeProcedures   = array();

/***************************************************************************************************
 * Custom PDF Class
 **************************************************************************************************/
class PDF extends FPDI_CellFit {
	private $practiceId;
	private $orderId;
	private $serviceRecordId;
	private $physicianId;
	private $practice  = array();
	private $physician = array();
	private $patient   = array();
	
	function Header() {
		/******************************************************************************************
 		 * Get needed data from database
 		 *****************************************************************************************/
 		$this->practiceId         = $_GET['practiceId'];
		$this->serviceRecordId    = $_GET['serviceRecordId'];
 		 try {
 		 	// Connection script
 		 	require('connect_to_mysql.php');
			// Practice
 		 	$stmt = $db->query("SELECT * FROM practice WHERE id='$this->practiceId'");
			$stmt->setFetchMode(PDO::FETCH_ASSOC);
			while($row = $stmt->fetch())
				$this->practice = $row;
			
			// Physician
 		 	$stmt = $db->query("SELECT physician.* 
 		 					    FROM service_record 
 		 					    LEFT JOIN physician 
 		 					    ON service_record.physician_id=physician.id 
 		 					    WHERE service_record.id='$this->serviceRecordId'");
			$stmt->setFetchMode(PDO::FETCH_ASSOC);
			while($row = $stmt->fetch())
				$this->physician = $row;
			
			// Patient
 		 	$stmt = $db->query("SELECT patient.*, service_record.date 
 		 					    FROM service_record 
 		 					    LEFT JOIN patient 
 		 					    ON service_record.patient_id=patient.id 
 		 					    WHERE service_record.id='$this->serviceRecordId'");
			$stmt->setFetchMode(PDO::FETCH_ASSOC);
			$rows = $stmt->fetchAll();
			$this->patient = $rows[0];
 		 }
		 catch (PDOException $e) {
		 	echo $e->getMessage() . "<br>";
		 }
			
		/******************************************************************************************
 		 * Clinic Info - Only on first page.
 		 *****************************************************************************************/
		if($this->PageNo() == 1) {
			$this->SetFont('Arial', 'B', 14);
			$this->Cell(0, 9, 'Chemotherapy Orders Status', 0, 2, 'C');
			$this->SetFont('Arial', 'B', 12);
			$this->SetX(70);
			$this->Cell(0,4, $this->practice['name'], 0, 1);
			$this->SetFont('Arial', '', 11);
			$this->SetX(70);
			$this->Cell(0,4, $this->practice['address'] . ', ' . $this->practice['city'] . ', '
					    . $this->practice['state'] . '-' . $this->practice['zip'], 0, 1);
			$this->SetX(70);
			$this->Cell(0,4, 'Phone: ' . $this->practice['phone'] . ', Fax: ' 
						. $this->practice['fax'], 0, 1);
		}

		/******************************************************************************************
 		 * Physician Information
 		 *****************************************************************************************/
		$this->SetFont('Arial', 'B', 14);
		$this->Cell(0, 11, $this->physician['first_name'] . ' ' . $this->physician['last_name'] . 
					', ' . $this->physician['degree'], 0, 1);
		$this->SetFont('Arial', '', 11);
		$y = $this->GetY();
		$this->SetY($y - 11);
		$this->Cell(0, 11, date('n/j/Y'), 0, 1, 'R');
		$this->SetY($y);
		$this->CellFit(0, 4, 'License No: ' . $this->physician['license'] . ', NPI: ' . 
				       $this->physician['npi'] . ', DEA: ' . $this->physician['dea'], 0, 1);
		if($this->PageNo() == 1)
			$this->Line(11, 48, 199, 48);
		else
			$this->Line(11, 27, 199, 27);

		/******************************************************************************************
 		 * Patient Information
 		 *****************************************************************************************/
 		 $dob = date($this->patient['date_of_birth']);
 		 if($this->PageNo() == 1)
		 	$this->SetY(49);
		 else
		 	$this->SetY(28);
 		 $this->CellFit(0, 8, 'Patient Name: ' . $this->patient['first_name'] . ' ' . 
 		                $this->patient['middle_name'] . ' ' . $this->patient['last_name'] . ', DOB: ' .
 		                 $dob . ', Age: ' . $this->dobToAge($dob) . ', Gender: ' . 
 		                 ucfirst($this->patient['gender']), 0, 1);
		 $this->SetFont('Arial', 'B', 11);
		 $this->Cell(30, 4, 'Date of Service: ');
		 $this->SetFont('Arial', '', 11);
		 $this->Cell(30, 4, '1/28/2013 ', 0, 1);
		 if($this->PageNo() == 1)
			$this->Line(11, 63, 199, 63);
		else
			$this->Line(11, 42, 199, 42);		
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
for($i = 1; $i < 40; $i++)
	$pdf->Cell(0,10, 'Printing line number' . $i, 0, 1);

/***************************************************************************************************
 * Output PDF
 **************************************************************************************************/
$pdf->output();