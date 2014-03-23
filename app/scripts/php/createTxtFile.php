<?php

//Get Sending ID and E-Card content
$id = $_POST['sendingID'];
$ecardContent = $_POST['ecardContent'];


$filename = $id.".txt";
	if (!$handle = fopen('../../msgLogs/'.$filename, 'w')) {
		echo "error";
		//return false;
	}

	if (fwrite($handle, $ecardContent) === FALSE) {
	    echo "error";
	    return false;
	}

    echo "success";
fclose($handle);

?>