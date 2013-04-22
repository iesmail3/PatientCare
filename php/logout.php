<?php
// Continue Session
session_start();
session_regenerate_id(TRUE);
// Destroy session
session_destroy();
// Return to login screen
header('location: ../index.php');
