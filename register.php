<?php
/**************************************************************************************************
 * File: Index.php
 * Author: Sean Malone
 * Description: This is the login page for users. This is just a temporary login page. iDBServices
 *              would like a fully integrated website with login added to that.
 *************************************************************************************************/
// Start session
session_start();
session_regenerate_id(TRUE);

// If session is already started, go to App
if(isset($_SESSION['practiceId']))
	header('location: app.php');

// MySQL connection
require('php/connect_to_mysql.php');
// Hashing framework
require('php/PasswordHash.php');
// Captcha
require('php/securimage/securimage.php');
$securimage = new Securimage();

$passwords = $key = $captcha = $passLength = true;
$success = false;
if(isset($_GET['success']))
	$success = true;
else if(isset($_POST['user'])) {	
	$clinic   = $_POST['clinic'];
	$username = $_POST['user'];
	$password = $_POST['pass'];
	$repass   = $_POST['passAgain'];
	$email	  = $_POST['email'];
	$rKey	  = $_POST['key'];
	$date 	  = date('Y-m-d');
	
	if($password != $repass)
		$passwords = false;
	else if(strlen($password) < 8 || strlen($password) > 72)
		$passLength = false;
	else if($rKey != 'P@t!N+13') 
		$key = false;
	else if($securimage->check($_POST['captcha_code']) == false)
		$captcha = false;
	else {
		$hasher = new PasswordHash(8, false);
		$hash = $hasher->HashPassword($password);
		// Add Clinic
		$stmt = $db->prepare("INSERT INTO practice (name, creation_date) VALUES(:clinic, :date)");
		$stmt->bindParam(':clinic', $clinic);
		$stmt->bindParam(':date', $date);
		$stmt->execute();
		
		// Get Clinic ID
		$stmt = $db->query("SELECT id FROM practice ORDER BY id DESC LIMIT 1");
		$stmt->setFetchMode(PDO::FETCH_ASSOC);
		$result = $stmt->fetchAll();
		$id = $result[0]['id'];
		
		// Roles
		$roles = array(
			array($id,"Administrator","This account is default and cannot be modified.","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2"),
			array($id,"Front Desk","This role is for Front Desk employees.","0","2","0","1","2","0","1","1","1","1","1","1","1","1","1","2","0","0","1","0","0","2","1","2","1","1","2","1","0","1","1","1","0","1","0","2","0","0","2","2","0","1","0","1"),
			array($id,"Guest","This is role is for Guest accounts","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"),
			array($id,"MD","This role is for doctors.","2","2","0","0","0","0","0","2","2","2","0","2","2","0","2","0","2","2","2","2","0","2","0","2","0","2","2","2","2","2","0","2","2","2","2","2","2","0","2","2","2","2","2","2"),
			array($id,"RN","This role is for nurses.","0","2","2","1","2","0","1","1","2","2","1","2","2","2","1","2","2","1","2","0","0","2","1","2","1","2","2","1","2","1","1","2","0","2","2","2","2","0","2","2","2","2","1","2")
		);
		
		// Generate placeholders
		$count = count($roles[0]);
		for($i = 0; $i < $count; $i++)
			$values[] = '?';
			
		// Query string
		$query = "INSERT INTO role 
			(practice_id,name,description,superbill,allergies,birth_history,
	       	 	clinic_details,checkout,copay_collection,development,diagnosis,family_history,
	       		follow_up,guidance,history,history_illness,immunization,instructions,insurance,
	       		insurance_verification,reports,manage_patients,manage_physician,
	       		manage_practice_type,manage_reason_code,manage_roles,manage_schedule,
	       		manage_users,medical_problems,medication,medication_orders,misc_docs,orders,
	       		other_options,personal_information,phone_log,physical_examination,prescription,
	       		review_of_systems,routine_exam,security,service_record,social_history,
	       		patient_superbill,vital_signs,diagnosis_instructions,physical_examination_sub)
	       	VALUES(" . implode(', ', $values) . ")";
			
		// Prepare Query
		$stmt = $db->prepare($query);
		// Execute queries
		foreach($roles as $role)
			$stmt->execute($role);
		
		// Get Adminstrator Role ID
		$stmt = $db->query("SELECT id FROM role WHERE name='Administrator' AND practice_id='$id'");
		$stmt->setFetchMode(PDO::FETCH_ASSOC);
		$result = $stmt->fetchAll();
		$role = $result[0]['id'];
		
		// Add user
		$stmt = $db->prepare("
			INSERT INTO user (practice_id, username, password, email, role_id) 
			VALUES(:id, :user, :pass, :email, :role)");
		$stmt->bindParam(':id', $id);
		$stmt->bindParam(':user', $username);
		$stmt->bindParam(':pass', $hash);
		$stmt->bindParam(':email', $email);
		$stmt->bindParam(':role', $role);
		$stmt->execute();
		
		// Success
		header('location: register.php?success=true');
	}
}
?>
<!DOCTYPE html>
<html>
<head>
	<title>PatientCare - Register</title>
	<!-- CSS -->
	<link type="text/css" rel="stylesheet" href="Content/bootstrap.css" />
	<link type="text/css" rel="stylesheet" href="Content/bootstrap-responsive.css" />
	<link type="text/css" rel="stylesheet" href="css/login.css" />
	<!-- Javascript -->
	<script type="text/javascript" src="Scripts/jquery-1.9.1.js"></script> 
	<script type="text/javascript" src="Scripts/bootstrap.min.js"></script>
	<script type="text/javascript">
		$(function() {
			// Click functions using jQuery
			$('.retrievePass').click(function(e) {
				e.preventDefault();
				$('.passwordForm').fadeIn('slow');
				$('.retrievePass').fadeOut('slow', function() {
					$('.closePass').fadeIn('slow');	
				});
			});
			
			$('.closePass').click(function(e) {
				e.preventDefault();
				$('.passwordForm').fadeOut('slow');
				$('.closePass').fadeOut('slow', function() {
					$('.retrievePass').fadeIn('slow');	
				});	
			});
			
			$('.sendButton').click(function(e) {
				e.preventDefault();
				
				$.post('php/forgotPass.php', {email: $('.email').val()});
				$('.passwordForm').fadeOut('slow');
				$('.closePass').fadeOut('slow', function() {
					$('.sentPass').text('Your password has been sent to ' + $('.email').val() + '.');
					$('.sentPass').fadeIn('slow');	
				});
			});
			
			$('.newCaptcha').click(function(e) {
				e.preventDefault();
				$('#captcha').attr('src', 'php/securimage/securimage_show.php?' + Math.random());
			});
		});
	</script>
</head>
<body>
	<!-- Banner -->
	<div class="container-fluid">
		<div class="row-fluid">
			<div class="banner">
				<img src="Content/images/logo.png" />
			</div>
		</div>
		<!-- Login form -->
		<div class="row-fluid">
			<?php if($success): ?>
			<div class="expiredLink">
				<h3>Your registration is successful.</h3>
				<p>Click <a href="index.php">here</a> to return to the login page.</p>
			</div>
			<?php else: ?>
			<form class="form-horizontal registerForm" action="" method="post">
				<div class="control-group">
					<label class="control-label" for-"clinic">Clinic Name</label>
					<div class="controls">
						<input type="text" id="clinic" name="clinic" placeholder="Clinic Name" />
					</div>
				</div>
				<div class="control-group">
					<label class="control-label" for-"user">Admin User</label>
					<div class="controls">
						<input type="text" id="user" name="user" placeholder="Username" />
					</div>
				</div>
				<div class="control-group">
					<label class="control-label" for-"password">Admin Password</label>
					<div class="controls">
						<input type="password" id="pass" name="pass" placeholder="Password" />
					</div>
				</div>
				<div class="control-group">
					<label class="control-label" for-"passAgain">Retype Password</label>
					<div class="controls">
						<input type="password" id="passAgain" name="passAgain" placeholder="Password" />
					</div>
				</div>
				<div class="control-group">
					<label class="control-label" for-"passAgain">Email</label>
					<div class="controls">
						<input type="email" id="email" name="email" placeholder="Email" />
					</div>
				</div>
				<div class="control-group">
					<label class="control-label" for-"passAgain">Registration Key</label>
					<div class="controls">
						<input type="text" id="key" name="key" placeholder="Registration Key" />
					</div>
				</div>
				<div class="control-group">
					<label class="control-label">Captcha</label>
					<div class="controls">
						<img id="captcha" src="php/securimage/securimage_show.php" alt="CAPTCHA IMAGE" />
						<input type="text" name="captcha_code" id="captcha_code" size="10" maxlength="6" />
						<a href="#" class="newCaptcha">New Image</a>
				</div>
				</div>
				<!-- Validation from PHP -->
				<?php if(!$passwords): ?>
					<div class="loginValidation">Passwords do not match.</div>
				<?php elseif(!$passLength): ?>
					<div class="loginValidation">Passwords must be between 8 and 72 characters.</div>
				<?php elseif(!$key): ?>
					<div class="loginValidation">Key is not valid.</div>
				<?php elseif(!$captcha): ?>
					<div class="loginValidation">The captcha did not match.</div>
				<?php endif; ?>
				<div class="control-group">
					<div class="controls">
						<button type="submit" class="btn btn-success">Register</button>
					</div>
				</div>
			</form>
			<?php endif; ?>
		</div>
	</div>
</body>
</html>