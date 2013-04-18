<?php 
require('fpdf/fpdf.php');

$path = '../uploads/' ; 
$practiceId = 1;
$filename = '/'.$_POST['filename'];
$filepath = $path.$practiceId.$filename;

$pdf = new FPDI_CellFit();
$pdf->AddPage();
$pdf->Image($filepath);
$pdf->Output();

	
