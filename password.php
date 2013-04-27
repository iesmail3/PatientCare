<?php
require('php/connect_to_mysql.php');
require('php/PasswordHash.php');

if(isset($_GET['id'])) {
	$guid =  $_GET['id'];
	// Grab retrieval data
	$stmt = $db->query("SELECT * FROM password_retrieval JOIN user ON password_retrieval.user_id=user.id WHERE guid='$guid'");
	$stmt->setFetchMode(PDO::FETCH_ASSOC);
	$row = $stmt->fetchAll();
	$row = $row[0];
	// Compute timestamp
	$dif  = (time() - strtotime(($row['timestamp']))) / 3600;
	if($dif > 1)
		$stmt2 = $db->exec("DELETE FROM password_retrieval WHERE guid='$guid'");
}
// Process form submission
$passCheck = false;
$userCheck = false;
$lengthCheck = false;
$success = false;
if(isset($_GET['success']))
	$success = true;
else if(isset($_POST['username'])) {
	
	if($_POST['username'] != $row['username']) {
		$userCheck = true;
	}
	else if($_POST['password'] != $_POST['confirmPassword'])
		$passCheck = true;	
	else if(strlen($_POST['password']) < 8)
		$lengthCheck = true;
	else {
		$hasher = new PasswordHash(8, FALSE);
		$stmt = $db->prepare("
			UPDATE user 
			SET password=:hash 
			WHERE id=:id AND practice_id=:practice
		");
		$stmt->bindParam(':hash', $hasher->HashPassword($_POST['password']));
		$stmt->bindParam(':id', $row['user_id']);
		$stmt->bindParam(':practice', $row['practice_id']);
		$stmt->execute();
		$stmt2 = $db->exec("DELETE FROM password_retrieval WHERE guid='$guid'");
		header('location: password.php?success=true');	
	}	
}

?>
<!DOCTYPE html>
<html>
<head>
	<title>Single Page Application Playground</title>
	<!-- CSS -->
	<link type="text/css" rel="stylesheet" href="Content/bootstrap.css" />
	<link type="text/css" rel="stylesheet" href="Content/bootstrap-responsive.css" />
	<link type="text/css" rel="stylesheet" href="css/login.css" />
	<!-- Javascript -->
	<script type="text/javascript" src="Scripts/jquery-1.9.1.js"></script> 
	<script type="text/javascript" src="Scripts/bootstrap.min.js"></script>
</head>
<body>
	<div class="container-fluid">
		<div class="row-fluid">
			<div class="banner">
				<img src="Content/images/logo.png" />
			</div>
		</div>
		<?php if($success): ?>
		<div class="expiredLink">
			<h3>Your password has been successfully changed.</h3>
			<p>Click <a href="index.php">here</a> to return to the login page.</p>
		</div>		
		<?php elseif($dif <= 1): ?>
		<div class="row-fluid">
			<form class="form-horizontal loginForm" action="" method="post">
				<div class="control-group">
					<label class="control-label" for-"user">User</label>
					<div class="controls">
						<input type="text" id="username" name="username" placeholder="Username" />
					</div>
				</div>
				<div class="control-group">
					<label class="control-label" for-"password">Password</label>
					<div class="controls">
						<input type="password" id="password" name="password" placeholder="Password" />
					</div>
				</div>
				<div class="control-group">
					<label class="control-label" for-"password">Confirm Password</label>
					<div class="controls">
						<input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" />
					</div>
				</div>
				<?php if($userCheck): ?>
					<div class="loginValidation">That user name does not match this password retrieval request.</div>
				<?php endif; ?>
				<?php if($passCheck): ?>
					<div class="loginValidation">Passwords do not match.</div>
				<?php endif; ?>
				<?php if($lengthCheck): ?>
					<div class="loginValidation">Passwords must be at least 8 characters.</div>
				<?php endif; ?>
				<div class="control-group">
					<div class="controls">
						<button type="submit" class="btn btn-lightgreen">Reset</button>
					</div>
				</div>
			</form>
		</div>

		<?php else: ?>
			<div class="expiredLink">
				<h3>This password retrieval link has expired.</h3>
				<p>Click <a href="index.php">here</a> to return to the login page.</p>
			</div>
		<?php endif; ?>
	</div>
</body>
</html>