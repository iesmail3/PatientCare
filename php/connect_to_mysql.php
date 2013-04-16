<?php
/***************************************************************************************************
 *  Database Parameters
 *
 * These are parameters for the database connection.
 **************************************************************************************************/
$host   = 'codeplanetapps.com';
$dbname = 'patient_care';
$user   = 'patient_care';
$pass   = 'nyJQRtaQyw2X2KJH';

try {
	// Connect to the database
	$db = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
	$db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );
} catch (PDOException $e) {
	echo $e->getMessage();
}
