<?php
// Continue Session
session_start();
// Destroy session
session_destroy();
// Return to login screen
header('location: ../index.php');
