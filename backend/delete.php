<?php
    if(isset($_POST["file"])){
        echo(unlink("/var/www/html/video/".$_POST["file"]));
    }
?>