<?php

//Get Sending ID and E-Card content
$html = $_POST['html'];
$id = $_POST['sendingID'];
var_dump($id);

$filename = "emailPreview-".$id.".html";
	if (!$handle = fopen('../../previewLogs/'.$filename, 'w')) {
		echo "error";
		//return false;
	}

	file_put_contents('../../previewLogs/'.$filename, "");	

	if (fwrite($handle, $html) === FALSE) {
	    echo "error";
	    return false;
	}

    echo "success";
fclose($handle);

?>