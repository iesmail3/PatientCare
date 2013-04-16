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
				<!--<img src="Content/images/logo2.png" />-->
			</div>
		</div>
		<div class="row-fluid">
			<form class="form-horizontal loginForm" action="app.php">
				<div class="control-group">
					<label class="control-label" for-"user">User</label>
					<div class="controls">
						<input type="text" id="user" name="user" placeholder="Username" />
					</div>
				</div>
				<div class="control-group">
					<label class="control-label" for-"password">Password</label>
					<div class="controls">
						<input type="text" id="password" name="password" placeholder="Password" />
					</div>
				</div>
				<div class="control-group">
					<div class="controls">
						<button type="submit" class="btn btn-lightgreen">Login</button>
					</div>
				</div>
			</form>
		</div>
		<div class="loginSeparator"></div>
		<div class="row-fluid">
			<div class="formFooter"><a href="#" class="retrievePass">Forgot Password?</a></div>
		</div>
	</div>
</body>
</html>