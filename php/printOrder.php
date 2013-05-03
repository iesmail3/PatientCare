<?php
/**************************************************************************************************
 * File: Print Order
 * Author: Sean Malone
 * Description: This script creates a pdf containing information for the Flow Sheet
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
$orderId            = $_GET['orderId'];
$serviceRecordId    = $_GET['serviceRecordId'];

/**************************************************************************************************
 * Custom PDF Class
 *************************************************************************************************/
class PDF extends FPDI_CellFit {
	
	function Header() {
 		$practiceId         = $_GET['practiceId'];
		$serviceRecordId    = $_GET['serviceRecordId'];
		$orderid			= $_GET['orderId'];
		$practice  = array();
		$physician = array();
		$patient   = array();
		$diagnosis = array();
 
		/******************************************************************************************
 		 * Get needed data from database
 		 *****************************************************************************************/
 		try {
 		 	// Connection script
 		 	require('connect_to_mysql.php');
			// Practice
 		 	$stmt = $db->query("SELECT * FROM practice WHERE id='$practiceId'");
			$stmt->setFetchMode(PDO::FETCH_ASSOC);
			while($row = $stmt->fetch())
				$practice = $row;
			
			// Physician
 		 	$stmt = $db->query("SELECT physician.* 
 		 					    FROM service_record 
 		 					    LEFT JOIN physician 
 		 					    ON service_record.physician_id=physician.id 
 		 					    WHERE service_record.id='$serviceRecordId'");
			$stmt->setFetchMode(PDO::FETCH_ASSOC);
			while($row = $stmt->fetch())
				$this->physician = $row;
			
			// Patient
 		 	$stmt = $db->query("SELECT patient.*, service_record.date 
 		 					    FROM service_record 
 		 					    LEFT JOIN patient 
 		 					    ON service_record.patient_id=patient.id 
 		 					    WHERE service_record.id='$serviceRecordId'");
			$stmt->setFetchMode(PDO::FETCH_ASSOC);
			$rows = $stmt->fetchAll();
			$patient = $rows[0];
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
			$this->Cell(0,4, $practice['name'], 0, 1);
			$this->SetFont('Arial', '', 11);
			$this->SetX(70);
			$this->Cell(0,4, $practice['address'] . ', ' . $practice['city'] . ', '
					    . $practice['state'] . '-' . $practice['zip'], 0, 1);
			$this->SetX(70);
			$this->Cell(0,4, 'Phone: ' . $practice['phone'] . ', Fax: ' 
						. $practice['fax'], 0, 1);
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
 		 $dob = date($patient['date_of_birth']);
 		 if($this->PageNo() == 1)
		 	$this->SetY(49);
		 else
		 	$this->SetY(28);
 		 $this->CellFit(0, 8, 'Patient Name: ' . $patient['first_name'] . ' ' . 
 		                $patient['middle_name'] . ' ' . $patient['last_name'] . ', DOB: ' .
 		                 $dob . ', Age: ' . $this->dobToAge($dob) . ', Gender: ' . 
 		                 ucfirst($patient['gender']), 0, 1);
		 $this->SetFont('Arial', 'B', 11);
		 $this->Cell(30, 4, 'Date of Service: ');
		 $this->SetFont('Arial', '', 11);
		 $this->Cell(30, 4, '1/28/2013 ', 0, 1);
		 if($this->PageNo() == 1)
			$this->Line(11, 63, 199, 63);
		 else
			$this->Line(11, 42, 199, 42);
		 $this->SetY($this->GetY() + 5);		
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
// Diagnosis
$stmt = $db->query("SELECT * 
					FROM diagnosis
				    WHERE service_record_id='$serviceRecordId'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
$diagnosis = $rows;

// Order
$stmt = $db->query("SELECT * 
					FROM orders
					LEFT JOIN order_category
					ON orders.order_category_id=order_category.id
				    WHERE orders.id='$orderId' ");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
if(count($rows) > 0)
	$order = $rows;

// Drugs
$stmt = $db->query("SELECT medication_order_log.*, medicine_list.code 
					FROM orders
					RIGHT JOIN medication_order_log
					ON medication_order_log.order_id=orders.id
					LEFT JOIN medicine_list
					ON medication_order_log.medicine=medicine_list.medicine_name
				    WHERE orders.service_record_id='$serviceRecordId'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
$drugs = $rows;

// Supplies
$stmt = $db->query("SELECT * 
					FROM orders
					RIGHT JOIN supplies
					ON supplies.order_id=orders.id
					LEFT JOIN supply_type
					ON supplies.supply_type_id=supply_type.id
				    WHERE orders.service_record_id='$serviceRecordId'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$supplies = $stmt->fetchAll();

/***************************************************************************************************
 * Setup PDF
 **************************************************************************************************/
$pdf = new PDF();
$pdf->AliasNbPages();
$pdf->AddPage();

/***************************************************************************************************
 * Diagnosis
 **************************************************************************************************/
// Heading
$pdf->SetFont('Arial','B',10);
$pdf->Cell(90, 5, 'Diagnosis');
$pdf->Cell(90, 5, 'ICD Code', 0, 1);

// Data
$count = 1;
$pdf->SetFont('Arial','',10);
foreach($diagnosis as $d) {
	$pdf->Cell(90, 5, $count . ' ' . $d['diagnosis']);
	$pdf->Cell(90, 5, $d['code'], 0, 1);
	$count++;
}
$y = $pdf->GetY() + 3;

// Separator
$pdf->Line(11, $y, 199, $y);	

/***************************************************************************************************
 * Order
 **************************************************************************************************/
if(count($order) > 0) {
	// Separator
	$y = $pdf->GetY() + 3;
	$pdf->Line(11, $y, 199, $y);

	// Type
	$pdf->SetY($pdf->GetY() + 5);
	$pdf->SetFont('Arial','B',10);
	$pdf->Cell(12, 5, 'Orders', 0, 1);
	$pdf->SetFont('Arial','',10);
	
	// Heading
	$pdf->SetY($pdf->GetY() + 2);
	$pdf->SetFont('Arial','BU', 10);
	$pdf->Cell(35, 5, 'Type');
	$pdf->Cell(50, 5, 'Description');
	$pdf->Cell(20, 5, 'Code');
	$pdf->Cell(30, 5, 'Unit');
	$pdf->Cell(30, 5, 'Cost', 0, 1);
	
	// Data
	$pdf->SetFont('Arial','',9);
	foreach($order as $d) {
		$pdf->CellFit(35, 6, $d['type']);
		$pdf->CellFit(50, 6, $d['description']);
		$pdf->CellFit(20, 6, $d['code']);
		$pdf->CellFit(15, 6, $d['unit']);
		$pdf->Cell(25, 5, '$' . $d['cost'], 0, 1, 'R');
	}
	
	// Separator
	$y = $pdf->GetY() + 3;
	$pdf->Line(11, $y, 199, $y);
}

/***************************************************************************************************
 * Drugs
 **************************************************************************************************/
if(count($drugs) > 0) {
	// Type
	$pdf->SetY($pdf->GetY() + 5);
	$pdf->SetFont('Arial','B',10);
	$pdf->Cell(12, 5, 'Drugs', 0, 1);
	$pdf->SetFont('Arial','',10);
	
	// Heading
	$pdf->SetY($pdf->GetY() + 2);
	$pdf->SetFont('Arial','BU', 10);
	$pdf->Cell(35, 5, 'Description');
	$pdf->Cell(20, 5, 'Code');
	$pdf->Cell(20, 5, 'Dose');
	$pdf->Cell(35, 5, 'Diluent');
	$pdf->Cell(20, 5, 'Volume');
	$pdf->Cell(20, 5, 'Seq#');
	$pdf->Cell(22, 5, 'Start Time');
	$pdf->Cell(22, 5, 'End Time', 0, 1);
	
	// Data
	$pdf->SetFont('Arial','',9);
	foreach($drugs as $d) {
		$pdf->CellFit(35, 6, $d['medicine']);
		$pdf->CellFit(20, 6, $d['code']);
		$pdf->CellFit(20, 6, $d['actual_dose']);
		$pdf->CellFit(35, 6, $d['diluent']);
		$pdf->CellFit(20, 6, $d['volume']);
		$pdf->CellFit(20, 6, $d['sequence_number']);
		$pdf->CellFit(22, 6, $d['start_time']);
		$pdf->CellFit(22, 6, $d['end_time'], 0, 1);
	}
	
	// Separator
	$y = $pdf->GetY() + 3;
	$pdf->Line(11, $y, 199, $y);
}

/***************************************************************************************************
 * Supplies
 **************************************************************************************************/
if(count($supplies) > 0) {
	// Type
	$pdf->SetY($pdf->GetY() + 5);
	$pdf->SetFont('Arial','B',10);
	$pdf->Cell(12, 5, 'Supplies', 0, 1);
	$pdf->SetFont('Arial','',10);
	
	// Heading
	$pdf->SetY($pdf->GetY() + 2);
	$pdf->SetFont('Arial','BU', 10);
	$pdf->Cell(50, 5, 'Description');
	$pdf->Cell(30, 5, 'Code');
	$pdf->Cell(30, 5, 'Units');
	$pdf->Cell(30, 5, 'Cost', 0, 1);
	
	// Data
	$pdf->SetFont('Arial','',9);
	foreach($supplies as $s) {
		$cost = number_format(floatval($s['quantity']) * floatval($s['cost']), 2);
		$pdf->CellFit(50, 6, $s['description']);
		$pdf->CellFit(30, 6, $s['code']);
		$pdf->CellFit(15, 6, $s['quantity'], 0);
		$pdf->CellFit(25, 6, '$' . $cost, 0, 1, 'R');
	}
}
  
/***************************************************************************************************
 * Output PDF
 **************************************************************************************************/
$pdf->output();