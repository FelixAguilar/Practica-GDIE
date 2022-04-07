<?php

if(isset($_POST["name"])){
    $dir = scandir('/var/www/html/video/');
    $res = array();
    for($i = 2; $i < count($dir); ++$i){
        if(strstr($dir[$i], $_POST["name"]) && strstr($dir[$i], "vtt")){
            array_push($res,$dir[$i]);  
        }
    }
    echo(json_encode($res));
}

?>