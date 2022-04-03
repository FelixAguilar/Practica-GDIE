<?php

if(isset($_POST["name"])){
    $type = strstr($_POST["name"], "meta");
    $file = fopen("/var/www/html/video/".$_POST["name"], "r") or die("Unable to open file!");
    $JSON = array();
    fgets($file);
    while(!feof($file)) {
        fgets($file);
        $line = fgets($file);
        $inicio = substr($line, 0, strpos($line, " "));
        $fin = substr($line, strrpos($line, " ", 0) + 1, -1);
        if($type){
            fgets($file);
            $line = fgets($file);
            $latitude = substr($line, strrpos($line, " ", 0) + 1, -2);
            $line = fgets($file);
            $longitude = substr($line, strrpos($line, " ", 0) + 1, -2);
            $line = fgets($file);
            $description = substr($line, strrpos($line, " ", 0) + 1, -1);
            fgets($file);
            $obj = array("inicio"=>$inicio, "fin"=>$fin, "latitud"=>$latitude, "longitud"=>$longitude, "descripcion"=>$description);
            array_push($JSON,$obj);
        }else{
            $line = fgets($file);
            $texto = str_replace("\n","",$line);
            $obj = array("inicio"=>$inicio, "fin"=>$fin, "texto"=>$texto);
            array_push($JSON,$obj);
        }
    }
    fclose($file);
    echo json_encode($JSON);
}

?>