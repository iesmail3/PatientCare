<?php
require('connect_to_mysql.php');
$user 	= json_decode($_GET['user'], true);
$method = $_GET['method'];

$to 	  = $user['email'];
$subject  = 'PatientCare password';
$guid 	  =  uniqid('',true);
$link 	  = "http://{$_SERVER['HTTP_HOST']}/patientcare/password.php?id=$guid";

$headers  = "From: " . "admin@patientcare.com" . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n"; 

$message  = '<html><body>';
$message .= "<h3>Hello, {$user['firstName']} {$user['lastName']}</h3>";
if($method == 'new')
	$message .= "<p>An account has been created for you at PatientCare.</p>";
else 
	$message .= "Someone at PatientCare has sent you a reset password request.";
$message .= "<p>Your username is: {$user['username']}";
$message .= "<p>Please follow this link to set your new password: <a href=\"$link\">$link</a></p>";
$message .= "If you feel that you received this email in error, please ignore it.</p>";
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
