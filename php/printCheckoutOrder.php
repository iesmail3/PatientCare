<?php
/**************************************************************************************************
 * File: printcheckoutOrder.php
 * Author: Imran Esmail
 * Description: This script creates a pdf containing information for the Checkout orders
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


class PDF extends FPDI_CellFit {

	function Header() {
		$practiceId         = $_GET['practiceId'];
		$patientId			= $_GET['patientId'];
		$serviceRecordId    = $_GET['serviceRecordId'];
		$checkoutId         = $_GET['checkoutId'];
		$practice  			= array();
		$physician 		 	= array();
	    $patient  			= array();
		$diagnosis          = array(); 
		$order              = array(); 
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
			
			//Diagnosis
 		 	$stmt = $db->query("SELECT diagnosis,code FROM diagnosis WHERE 
								diagnosis.service_record_id='$serviceRecordId'");
			$stmt->setFetchMode(PDO::FETCH_ASSOC);
			$rows = $stmt->fetchAll();
			$diagnosis = $rows;
			
		}
		catch (PDOException $e) {
			echo $e->getMessage() . "<br>";
		}
			
		/******************************************************************************************
 		 * Clinic Info - Only on first page.
 		*****************************************************************************************/
		if($this->PageNo() == 1) {
			$this->SetFont('Arial', 'B', 14);
			$this->Cell(0, 9, 'Patient Orders', 0, 2, 'C');
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
		
			/******************************************************************************************
			 * Physician Information
			 *****************************************************************************************/
			$this->SetFont('Arial', 'B', 14);
			$this->Cell(0, 11, $physician['first_name'] . ' ' . $physician['last_name'] . 
						', ' . $physician['degree'], 0, 1);
			$this->SetFont('Arial', '', 11);
			$y = $this->GetY();
			$this->SetY($y - 11);
			$this->Cell(0, 11, date('n/j/Y'), 0, 1, 'R');
			$this->SetY($y);
			$this->CellFit(0, 4, 'License No: ' . $physician['license'] . ', NPI: ' . 
						   $physician['npi'] . ', DEA: ' . $physician['dea'], 0, 1);
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
			 if($this->PageNo() == 1)
				$this->Line(11, 63, 199, 63);
			else
				$this->Line(11, 42, 199, 42);	
		
			/******************************************************************************************
			 * Diagnosis Information
			 *****************************************************************************************/
			 //Headers
			 $this->SetY(65);
			 $this->SetFont('Arial','B',11);
			 $this->Cell(65, 7, 'Diagnosis');
			 $this->Cell(30, 7, 'ICD Code',0,1);
			 $this->SetFont('Arial','',10);
			 // Data
			 foreach($diagnosis as $d) {
				$this->Cell(65,7,$d['diagnosis']); 
				$this->Cell(30,7, $d['code'],0,1);
			 }
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
 * Pull Data from Database
 **************************************************************************************************/
// Order
$stmt = $db->query("SELECT * 
					FROM orders
					JOIN order_category
					ON orders.order_category_id=order_category.id
				    WHERE orders.service_record_id='$serviceRecordId'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
$orders = $rows;

/***************************************************************************************************
 * Setup PDF
 **************************************************************************************************/
$pdf = new PDF();
$pdf->AliasNbPages();
$pdf->AddPage();

  
/***************************************************************************************************
 * Order
 **************************************************************************************************/
 //Header
 $y = $pdf->GetY();
 $pdf->SetY($y +3);
 if(count($orders) > 0) {
	$pdf->SetFont('Arial','B',11);
	$pdf->Cell(65, 7, 'Order'); 
}
 $y = $pdf->GetY();
 $pdf->SetY($y +10);
 
 // Data
 foreach($orders as $o) {
	$y = $pdf->GetY();
    $pdf->SetY($y +4);
	$pdf->SetFont('Arial','B',11);
    $pdf->Cell(15, 7, 'Order:');
	$pdf->SetFont('Arial','B',11);
	$pdf->Cell(50,7,$o['type']); 
	$pdf->Cell(35, 7, 'Diagnostic Center:');
    $pdf->Cell(30,7,$o['center']);
	$pdf->Cell(20, 7, 'InOffice:');
	if($o['in_office'] =='1') { 
		  
	  $pdf->Image('checkmark.JPG',null,null,8);
	
	}
	else
		$pdf->Image('unchecked.JPG',null,null,13);
	 // Line break
    $pdf->Ln(5);
	$pdf->SetFont('Arial','',11);
	$pdf->Cell(30, 7, 'Comments:');
	$pdf->Cell(50,7,$o['comment'],0,1);
	$pdf->Cell(30, 7, 'Instructions:');
	$pdf->Cell(50,7,$o['instructions'],0,1);
	$pdf->SetFont('Arial','U',11);
	$y = $pdf->GetY();
	$pdf->SetY($y +5);
	$pdf->Cell(70, 7, 'Description');
	$pdf->Cell(30, 7, 'Code',0,1);
	$pdf->SetFont('Arial','',11);
	$pdf->Cell(70,7,$o['description']);
	$pdf->Cell(15,7,$o['code'],0,1);
	// Separator
	$y = $pdf->GetY() + 3;
	$pdf->Line(11, $y, 199, $y,0,1);
}  
 
  
 
  
/***************************************************************************************************
 * Output PDF
 **************************************************************************************************/
$pdf->output();