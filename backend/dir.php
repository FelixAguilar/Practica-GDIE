<?php

$dir = scandir("../video/");
$res = array();
for($i = 2; $i < count($dir); ++$i){
    if(str_ends_with($dir[$i], "vtt")){
        array_push($res,$dir[$i]);  
    }
}
echo(json_encode($res));

?>