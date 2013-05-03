<?php
/***************************************************************************************************
 * File: Save User
 *
 * Author(s): Sean Malone
 *
 * Description: This script is a specialized version of query.php. It needs to hash the password.
 **************************************************************************************************/
 
session_start();
/**************************************************************************************************
 * Passed Variables
 *************************************************************************************************/
$practiceId = $_SESSION['practiceId'];
$values   = json_decode($_POST['values'], true);
$values['practiceId'] = $practiceId;

/**************************************************************************************************
 * Includes
 *************************************************************************************************/
require('connect_to_mysql.php');

// If new
if(strlen($values['id']) == 0) {
	$stmt = $db->query("SELECT id FROM user WHERE practice_id='$practiceId' ORDER BY id DESC LIMIT 1");
	$stmt->setFetchMode(PDO::FETCH_ASSOC);
	$result = $stmt->fetchAll();
	$result = intval($result[0]['id']) + 1;
	
	$stmt = $db->prepare(
		"INSERT INTO user 
		(id, practice_id, username, first_name, last_name, email, role_id)
		VALUES(:id, :practice, :user, :first, :last, :email, :role)"
	);
	$stmt->bindParam(':id',       	$result);
	$stmt->bindParam(':practice', 	$values['practiceId']);
	$stmt->bindParam(':user', 		$values['username']);
	$stmt->bindParam(':first',	 	$values['firstName']);
	$stmt->bindParam(':last', 		$values['lastName']);
	$stmt->bindParam(':email', 		$values['email']);
	$stmt->bindParam(':role', 		$values['roleId']);
	$stmt->execute();
	$affected = $stmt->rowCount();
	if($affected > 0)
		echo json_encode(array('result' => 'insertSuccess', 'id' => $result));
	else
		echo 'insertFail';
}
else {
	$stmt = $db->prepare("
		UPDATE user
		SET username=:user, first_name=:first, last_name=:last,	
			email=:email, role_id=:role
		WHERE id='{$values['id']}' AND practice_id='$practiceId'
	");
	$stmt->bindParam(':user',  $values['username']);
	$stmt->bindParam(':first', $values['firstName']);
	$stmt->bindParam(':last',  $values['lastName']);
	$stmt->bindParam(':email', $values['email']);
	$stmt->bindParam(':role',  $values['roleId']);
	$stmt->execute();
	$affected = $stmt->rowCount();
	if($affected > 0)
		echo json_encode(array('result' => 'updateSuccess'));
	else
		echo 'updateFail';
}
