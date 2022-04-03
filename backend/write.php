<?php

if (isset($_POST["name"]) && isset($_POST["data"])) {
    $file = fopen("/var/www/html/video/".$_POST['name'], "w") or die("Unable to open file!");
    fwrite($file, $_POST['data']);
    fclose($file);
}

?>