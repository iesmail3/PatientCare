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
$join = "";
if(isset($_GET['join']))
	$join  = $_GET['join'];

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
	$db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );
	
	// If Select is chosen
	if(strtolower($mode) == 'select') {
		$fieldString = "";
		if(is_array($fields)) {
			foreach($fields as $field) {
				$fieldString .= "$field,";
			}
			$fieldString = substr_replace($fieldString ,"",-1);
		}
		else {
			$fieldString = $fields;
		}
		// Compile query
		$query = "SELECT $fieldString FROM $table $join $where $group $order $limit";
		//echo $query;
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
		// Remove nulls
		for($i = 0; $i < count($fields); $i++) {
			if($values[$i] == '') {
				unset($fields[$i]);
				$fields = array_values($fields);
				unset($values[$i]);
				$values = array_values($values);
			}
		}
		// Create nameholders
		$nameholders = "(";
		$fieldString = "(";
		foreach($fields as $field) {
			$nameholders .= ":$field,";
			$fieldString .= "`$field`,";
		}
		$nameholders = substr_replace($nameholders ,"",-1) . ")";
		$fieldString = substr_replace($fieldString ,"",-1) . ")";
		
		$query = "INSERT INTO $table $fieldString VALUES $nameholders $where";
		// Run Query
		$stmt = $db->prepare($query);
		// Bind parameters
		for($i = 0; $i < count($fields); $i++) {
			$stmt->bindParam(":" . $fields[$i], $values[$i]);
		}
		$stmt->execute();
		
		// Check for failure
		$rows_affected = $stmt->rowCount(); 
		if($rows_affected < 1) {
			echo "insertFail";
		}
		else
			echo 'insertSuccess';
	}
	// If delete is Chosen
	else if($mode == 'delete') {
		if($where != "") {
			$query = "DELETE FROM $table $where";
			// Run Query
			$stmt = $db->prepare($query);
			$stmt->execute();
			
			// Check for failure
			$rows_affected = $stmt->rowCount(); 
			if($rows_affected < 1) {
				echo "deleteFail";
			}
			else {
				echo 'deleteSuccess';
			}
		}
	}
	// If Update is chosen
	else if($mode == 'update') {
		// Remove nulls
		/*for($i = 0; $i < count($fields); $i++) {
			if($values[$i] == '') {
				unset($fields[$i]);
				$fields = array_values($fields);
				unset($values[$i]);
				$values = array_values($values);
			}
		}*/
		
		// Create nameholders
		$set = "";
		for($i = 0; $i < count($fields); $i++) {
			$set .= "`{$fields[$i]}`='{$values[$i]}', ";
		}
		// Remove last AND
		$set = substr_replace($set, "", -2, strlen($set));
		
		$query = "UPDATE `$table` SET $set $where";
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
			echo 'updateFail';
		}
		else {
			echo 'updateSuccess';
		}
	}
}
// Something went wrong
catch (PDOException $e) {
	echo 'fail';
}