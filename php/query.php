<?php
/***************************************************************************************************
 *  POST Variables
 *
 * These are variables that come from the frontend.
 **************************************************************************************************/
$mode = $_GET['mode'];
$query = $_GET['query'];

/***************************************************************************************************
 *  Database Parameters
 *
 * These are parameters for the database connection.
 **************************************************************************************************/
$host = 'codeplanetapps.com';
$dbname = 'senior_design';
$user = 'senior_design';
$pass = '77dj7HC2LcBDjCPV';

// Exception handling
try {
	// Connect to the database
	$db = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
	
	// If Select is chosen
	if(strtolower($mode) == 'select') {
		// Make the string safe
		$query = $db->quote($query);
		// Create query statement to run
		$stmt = $db->query($query);
		// Fetch method
		$stmt->setFetchMode(PDO::FETCH_ASSOC);
		
		// Grab each row
		$result = array();
		while($row = $stmt->fetch()) {
			$name  = $row['name'];
			$dob   = $row['dob'];
			$phone = $row['phone'];
			$email = $row['email'];
			
			array_push($result, array('name' => $name, 'dob' => $dob, 'phone' => $phone, 'email' => $email));
		}
		
		// Echo json to the page. 
		echo json_encode($result);
	}
	// If Insert is chosen
	else if($mode == 'insert') {
		// Make the string safe
		$query = $db->quote($query);
		// Run Query
		$stmt = $db->prepare($query);
		$stmt->execute();
	}
	// If delete is Chosen
	else if($mode == 'delete') {
		// Make the string safe
		$query = $db->quote($query);
		// Run Query
		$db->exec($query);
	}
	// If Update is chosen
	else if($mode == 'update') {
		// TODO
	}
}
catch (PDOException $e) {
	echo $e->getMessage();
}