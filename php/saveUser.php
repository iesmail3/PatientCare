<?php
session_start();
/**************************************************************************************************
 * Passed Variables
 *************************************************************************************************/
$practiceId = $_SESSION['practiceId'];
$password =  $_POST['password'];
$values   = json_decode($_POST['values'], true);
$values['practiceId'] = $practiceId;

/**************************************************************************************************
 * Includes
 *************************************************************************************************/
require('connect_to_mysql.php');
require('PasswordHash.php');

/**************************************************************************************************
 * Encrypt Password
 *************************************************************************************************/
if(strlen($password) > 0) {
	$hasher = new PasswordHash(8, false);
	$hash = $hasher->HashPassword($password);
	$values['password'] = $hash;
	if(strlen($hash) < 20)
		exit('encryptionFail');
}

// If new
if(strlen($values['id']) == 0) {
	$stmt = $db->query("SELECT id FROM user WHERE practice_id='$practiceId' ORDER BY id DESC LIMIT 1");
	$stmt->setFetchMode(PDO::FETCH_ASSOC);
	$result = $stmt->fetchAll();
	$result = intval($result[0]['id']) + 1;
	
	$stmt = $db->prepare(
		"INSERT INTO user 
		(id, practice_id, username, password, first_name, last_name, email, role_id)
		VALUES(:id, :practice, :user, :pass, :first, :last, :email, :role)"
	);
	$stmt->bindParam(':id',       	$result);
	$stmt->bindParam(':practice', 	$values['practiceId']);
	$stmt->bindParam(':user', 		$values['username']);
	$stmt->bindParam(':pass', 		$values['password']);
	$stmt->bindParam(':first',	 	$values['firstName']);
	$stmt->bindParam(':last', 		$values['lastName']);
	$stmt->bindParam(':email', 		$values['email']);
	$stmt->bindParam(':role', 		$values['roleId']);
	$stmt->execute();
	$affected = $stmt->rowCount();
	if($affected > 0)
		echo $result;
	else
		echo 'insertFail';
}
else {
	$stmt = $db->prepare("
		UPDATE user
		SET username=:user, password=:pass, first_name=:first, last_name=:last,	
			email=:email, role_id=:role
		WHERE id='{$values['id']}' AND practice_id='$practiceId'
	");
	$stmt->bindParam(':user',  $values['username']);
	$stmt->bindParam(':pass',  $values['password']);
	$stmt->bindParam(':first', $values['firstName']);
	$stmt->bindParam(':last',  $values['lastName']);
	$stmt->bindParam(':email', $values['email']);
	$stmt->bindParam(':role',  $values['roleId']);
	$stmt->execute();
	$affected = $stmt->rowCount();
	echo $affected;
	if($affected > 0)
		echo 'updateSuccess';
	else
		echo 'updateFail';
}
