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
		$references			= array();
		$insurance			= array();
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
			
			//Patient
			$stmt = $db->query("SELECT patient.* FROM patient WHERE id='$patientId'");
			$stmt->setFetchMode(PDO::FETCH_ASSOC);
			$rows = $stmt->fetchAll();
			$patient = $rows[0];
			
			//Spouse
			$stmt = $db->query("SELECT spouse.* FROM spouse WHERE patient_id='$patientId' AND practice_id='$practiceId'");
			$stmt->setFetchMode(PDO::FETCH_ASSOC);
			$rows = $stmt->fetchAll();
			$spouse = $rows[0];
			
			//Employer
			$stmt = $db->query("SELECT employer.* FROM employer WHERE patient_id='$patientId' AND practice_id='$practiceId'");
			$stmt->setFetchMode(PDO::FETCH_ASSOC);
			$rows = $stmt->fetchAll();
			$employer = $rows[0];
			
			//References
			$stmt = $db->query("SELECT * FROM reference WHERE patient_id='$patientId' AND practice_id='$practiceId'");
			$stmt->setFetchMode(PDO::FETCH_ASSOC);
			$rows = $stmt->fetchAll();
			if(count($rows) > 0)
				$references = $rows;
			
			//Insurance
			$stmt = $db->query("SELECT insurance.* FROM insurance WHERE patient_id='$patientId' AND practice_id='$practiceId'");
			$stmt->setFetchMode(PDO::FETCH_ASSOC);
			$rows = $stmt->fetchAll();
			$insurance = $rows[0];
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
		/******************************************************************************************
 		 * Patient Information
 		 *****************************************************************************************/
		$this->SetFont('Arial', 'B', 11);
		$this->Cell(0, 8, 'Patient: ' . $patient['first_name'] . ' ' .
					$patient['middle_name'] . ' ' . $patient['last_name'], 0, 0);
		$this->SetFont('Arial', '', 11);
		$this->Cell(0, 8, date('n/j/Y'), 0, 1, 'R');
 		$dob = date($patient['date_of_birth']);
		$this->CellFit(0, 5, 'Gender: ' . ucfirst($patient['gender']) . ', DOB: ' . $dob .
						', ID Number: ' . $patient['id_number'] .
						', ID Type: ' . $patient['id_type'], 0, 1);
		$this->CellFit(0, 5, 'Phone: ' . $patient['phone'] . ', Mobile: ' . $patient['mobile'] .
						', Email: ' . $patient['email'], 0, 1);
		
		/******************************************************************************************
 		 * Address & Spouse Information
 		 *****************************************************************************************/
		$this->SetFont('Arial', 'B', 11);
		$this->Cell(100, 8, 'Address:', 0, 0);
		$this->CellFit(0, 8, 'Spouse Information: ' . ucfirst($patient['marital_status']) .
					', Children: ' . $patient['number_of_children'], 0, 1);
		$this->SetFont('Arial', '', 11);
		$dob = date($spouse['date_of_birth']);
		$this->Cell(100, 5, $patient['country'], 0, 0);
		$this->CellFit(0, 5, 'Spouse Name: ' . $spouse['first_name'] . ' ' . $spouse['last_name'], 0, 1);
		$this->Cell(100, 5, $patient['address'], 0, 0);
		$this->Cell(0, 5, 'Phone: ' . $spouse['phone'] . ' Work: ' . $spouse['work_phone'], 0, 1);
		$this->CellFit(100, 5, $patient['city'] . ', ' . $patient['state'] . ' ' . $patient['zip'], 0, 0);
		$this->CellFit(0, 5, 'ID Number: ' . $spouse['id_number'] . ', ID Type: ' . $spouse['id_type'] .
						', DOB: ' . $dob, 0, 1);
		
		/******************************************************************************************
 		 * Emergency Information & Employer Information
 		 *****************************************************************************************/
		$this->SetFont('Arial', 'B', 11);
		$this->Cell(100, 8, 'Emergency Contact Information:', 0, 0);
		$this->Cell(0, 8, 'Employer Information:', 0, 1);
		$this->SetFont('Arial', '', 11);
		$this->CellFit(100, 5, 'Emergency Contact: ' . $patient['contact_name'], 0, 0);
		$this->CellFit(0, 5, 'Employer: ' . $employer['company_name'], 0, 1);
		$this->CellFit(100, 5, 'Relationship: ' . $patient['contact_relationship'], 0, 0);
		$this->CellFit(0, 5, 'Address: ' . $employer['address'], 0, 1);
		$this->CellFit(100, 5, 'Phone: ' . $patient['contact_phone'] . ', Cell: ' . $patient['contact_mobile'], 0, 0);
		$this->CellFit(0, 5, $employer['city'] . ', ' . $employer['state'] . ' ' . $employer['zip'], 0, 1);
		$this->SetX(110);
		$this->CellFit(0, 5, 'Phone: ' . $employer['phone'] . ' Ext: ' . $employer['phone_ext'], 0, 1);
		$y = $this->GetY() + 6;
		$this->Line(11, $y, 199, $y);
		
		/******************************************************************************************
 		 * References
 		 *****************************************************************************************/
		$y = $this->GetY() + 12;
		$this->SetY($y);
		foreach($references as $reference) {
			switch($reference['type']) {
				case 'referringphysician':
					$this->CellFit(0, 5, 'Referring Physician: ' . $reference['first_name'] . ' ' .
								$reference['middle_name'] . ' ' . $reference['last_name'] . ', ' .
								$reference['degree'], 0, 1);
					$this->CellFit(0, 5, 'Phone: ' . $reference['phone'] . ' Fax: ' .
									$reference['fax'], 0, 1);
					break;
				case 'pcp':
					$this->CellFit(0, 5, 'PCP: ' . $reference['first_name'] . ' ' .
								$reference['middle_name'] . ' ' . $reference['last_name'] . ', ' .
								$reference['degree'], 0, 1);
					$this->CellFit(0, 5, 'Phone: ' . $reference['phone'] . ' Fax: ' .
									$reference['fax'], 0, 1);
					break;
				case 'other':
					$this->CellFit(0, 5, 'Other: ' . $reference['first_name'] . ' ' .
								$reference['middle_name'] . ' ' . $reference['last_name'] . ', ' .
								$reference['degree'], 0, 1);
					$this->CellFit(0, 5, 'Phone: ' . $reference['phone'] . ' Fax: ' .
									$reference['fax'], 0, 1);
					break;

			}
		}
		$y = $this->GetY() + 6;
		$this->Line(11, $y, 199, $y);
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