<?php
	
if(isset($_GET['dir']) && $_GET['dir'] != "") {
	$path = $_GET['dir'];
	
	echo json_encode(listdir_desc($path));
}

function listdir_by_date($path){
	$files = glob($path.'/*',GLOB_ONLYDIR);
	
	foreach ($files as $f){
	    $tmp[basename($f)] = filectime($f);
	}
	
	arsort($tmp);
	$files = array_keys($tmp);
	
	return $files;
}

function listdir_desc($path){
	$files = array();
	
	if ($handle = opendir($path)) {

	 	while (false !== ($file = readdir($handle))) {
	 		if ($file != "." && $file != ".." && $file != ".DS_Store") {
	 			$files[$file] = $file;
	 		}
	 	}
	}
	closedir($handle);
	
	krsort($files);
	
	return $files;
}

?>