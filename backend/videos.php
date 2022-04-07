<?php

function lookfor($dir, $file){
    for($j = 2; $j < count($dir); ++$j){
        if(strstr($dir[$j], $file)){
            return $dir[$j];
        }
    }
    return "";
}

$dir = scandir('/var/www/html/video/');
$res = array();
for($i = 2; $i < count($dir); ++$i){
    if(strstr($dir[$i], "mp4")){
        $vidmp4 = $dir[$i];
        $name = substr($vidmp4, 0, strpos($vidmp4, ".", 0));
        $vidwebm = lookfor($dir, $name.".webm");
        $vides = lookfor($dir, $name."_es.vtt");
        $vidjp = lookfor($dir, $name."_jp.vtt");
        $vidmeta = lookfor($dir, $name."_meta.vtt");
        $obj = array ("mp4"=>$vidmp4, "webm"=>$vidwebm, "es"=>$vides, "jp"=>$vidjp, "meta"=>$vidmeta);
        array_push($res,$obj);
    }
}
echo(json_encode($res));

?>