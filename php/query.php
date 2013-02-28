<?php
/***************************************************************************************************
 *  POST Variables
 *
 * These are variables that come from the frontend.
 **************************************************************************************************/
$mode   = $_GET['mode'];
$table  = $_GET['table'];
$fields = $_GET['fields'];
$where  = $_GET['where'];
$values = $_GET['values'];

/***************************************************************************************************
 *  Database Parameters
 *
 * These are parameters for the database connection.
 **************************************************************************************************/
$host = 'codeplanetapps.com';
$dbname = 'patient_care';
$user = 'patient_care';
$pass = 'nyJQRtaQyw2X2KJH';

// Exception handling
try {
	// Connect to the database
	$db = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
	
	// If Select is chosen
	if(strtolower($mode) == 'select') {
		// Compile query
		$query = "SELECT $fields FROM $table";
		// Create query statement to run
		$stmt = $db->query($query);
		// Fetch method
		$stmt->setFetchMode(PDO::FETCH_ASSOC);
		// Grab each row
		$result = $stmt->fetchAll();
		// Echo json to the page. 
		echo json_encode($result);
	}
	// If Insert is chosen
	else if($mode == 'insert') {
		// Create nameholders
		$nameholders = "(";
		$fieldString = "(";
		foreach($fields as $field) {
			$nameholders .= ":$field,";
			$fieldString .= "$field,";
		}
		$nameholders = substr_replace($nameholders ,"",-1) . ")";
		$fieldString = substr_replace($fieldString ,"",-1) . ")";
		
		$query = "INSERT INTO $table $fieldString VALUES $nameholders";
		// Run Query
		$stmt = $db->prepare($query);
		// Bind parameters
		for($i = 0; $i < count($fields); $i++) {
			$stmt->bindParam(":" . $fields[$i], $value[$i]);
		}
		$stmt->execute();
		
		// Check for failure
		$rows_affected = $stmt->rowCount(); 
		if($rows_affected < 1) {
			
		}
	}
	// If delete is Chosen
	else if($mode == 'delete') {
		if($where != "") {
			$query = "DELETE FROM $table $where";
			// Run Query
			$db->exec($query);
			
			// Check for failure
			$rows_affected = $stmt->rowCount(); 
			if($rows_affected < 1) {
				
			}
	}
	// If Update is chosen
	else if($mode == 'update') {
		// Create nameholders
		$set = "";
		for($i = 0; $i < count($fields); $i++) {
			$set .= "{$fields[$i]}='{$values[$i]}' AND ";
		}
		// Remove last AND
		$set = substr_replace($set, "", -5, strlen($set));
		
		$query = "UPDATE $table SET $set $where";

		// Run Query
		$stmt = $db->prepare($query);
		// Bind parameters
		for($i = 0; $i < count($fields); $i++) {
			$stmt->bindParam(":" . $fields[$i], $value[$i]);
		}
		$stmt->execute();
		
		// Check for failure
		$rows_affected = $stmt->rowCount(); 
		if($rows_affected < 1) {
			echo 'fail';
		}
	}
}
catch (PDOException $e) {
	echo 'fail';
}