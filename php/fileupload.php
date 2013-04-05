 <? php  
// list of valid extensions, ex. array("jpeg", "xml", "bmp")
    $allowedExtensions = array();
    // max file size in bytes
    $sizeLimit = 10 * 1024 * 1024;
    //the input name set in the javascript
    $inputName = 'qqfile';

    $uploader = new qqFileUploader($allowedExtensions, $sizeLimit, $inputName);

    $result = $uploader->handleUpload('uploads/');
    header("Content-Type: text/plain");
    echo htmlspecialchars(json_encode($result), ENT_NOQUOTES);
	
?>