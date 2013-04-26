<?php
require('connect_to_mysql.php');
$email 	= $_POST['email'];

$stmt = $db->query("SELECT * FROM user WHERE email='$email'");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$user = $stmt->fetchAll();

if(count($user) > 0) {
	$user = $user[0];
	
	$to 	  = $user['email'];
	$subject  = 'PatientCare password';
	$guid 	  =  uniqid('',true);
	$link 	  = "http://{$_SERVER['HTTP_HOST']}/patientcare/password.php?id=$guid";
	
	$headers  = "From: " . "admin@patientcare.com" . "\r\n";
	$headers .= "MIME-Version: 1.0\r\n";
	$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n"; 
	
	$message  = '<html><body>';
	$message .= "<h3>Hello, {$user['first_name']} {$user['last_name']}</h3>";
	$message .= "You requested a password reset at PatientCare.";
	$message .= "<p>Your username is: {$user['username']}";
	$message .= "<p>Please follow this link to set your new password: <a href=\"$link\">$link</a></p>";
	$message .= "If you feel that you received this email in error, please ignore this email.</p>";
	$message .= "<br />";
	$message .= "<p>Thanks,</p>";
	$message .= "<p>The PatientCare team</p>";
	$message .= '</body></html>';
	
	mail($to, $subject, $message, $headers);
	
	$stmt = $db->prepare("INSERT INTO password_retrieval (user_id, guid, timestamp) VALUES (:user, :guid, :time)");
	$stmt->bindParam(':user', $user['id']);
	$stmt->bindParam(':guid', $guid);
	$stmt->bindValue(':time', date('Y-m-d H:i:s'));
	$stmt->execute();
}
