<?php
/***************************************************************************************************
 * File: query.php
 *
 * Author(s): Sean Malone and Imran Esmail
 *
 * Description: This script receives input from the front end. It then builds and runs a query to
 * the MySQL database, patient_care. Once the query returns, the script either sends the records
 * or a failure note back to the frontend. This script does not rely on any frontend functionality.
 * The script assumes that the GET variables are provided as url parameters.
 **************************************************************************************************/
 
/***************************************************************************************************
 *  GET Variables
 *
 * These are variables that come from the frontend.
 * $mode   - The query operation to be performed
 * $table  - Which table to query
 * $fields - Which fields (attributes) in the table for the query
 * $values - Used for INSERT/UPDATE operations to send values to db
 * $where  - WHERE clause
 * $order  - ORDER clause
 * $limit  - LIMIT clause
 **************************************************************************************************/
$mode = "";
if(isset($_GET['mode']))
	$mode   = $_GET['mode'];
$table = "";
if(isset($_GET['table']))	
	$table  = $_GET['table'];
$fields = "";
if(isset($_GET['fields']))	
	$fields = $_GET['fields'];
$values = "";
if(isset($_GET['values']))
	$values = $_GET['values'];
$where = "";
if(isset($_GET['where']))
	$where  = $_GET['where'];
$group = "";
if(isset($_GET['group']))
	$group  = $_GET['group'];
$order = "";
if(isset($_GET['order']))
	$order  = $_GET['order'];
$limit = "";
if(isset($_GET['limit']))
	$limit  = $_GET['limit'];

/***************************************************************************************************
 *  Database Parameters
 *
 * These are parameters for the database connection.
 **************************************************************************************************/
$host = 'codeplanetapps.com';
$dbname = 'patient_care';
$user = 'patient_care';
$pass = 'nyJQRtaQyw2X2KJH';

try {
	// Connect to the database
	$db = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
	
	// If Select is chosen
	if(strtolower($mode) == 'select') {
		// Compile query
		$query = "SELECT $fields FROM $table $where $group $order $limit";
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
		
		$query = "INSERT INTO $table VALUES $nameholders $where";
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
			echo "fail";
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
				echo "fail";
			}
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
// Something went wrong
catch (PDOException $e) {
	echo 'fail';
}