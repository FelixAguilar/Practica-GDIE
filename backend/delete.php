<?php
    if(isset($_POST["file"])){
        echo(unlink("../video/".$_POST["file"]));
    }
?>