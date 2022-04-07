var vid;  // video
var tini; // tiempo inicial segmento.
var tfin; // tiempo final segmento.
var ttex; // Texto del segmento.
var tlat; // Latitud del segmento.
var tlon; // Longitud del segmento.
var tzoo; // Zoom del mapa.
var tdes; // Descripcion del segmento.
var file; // archivo que se edita.
var json; // contenido en array del archivo.
var type; // tipo de archivo a editar.

window.onload = function(){
    player_start();
    editor_start();
}

function editor_start(){
    vid = document.getElementsByTagName("video")[0];
    dirVTT();
}

// Inicia el temporizador del segmento.
function newSegment(){
    tini.value = time(vid.currentTime);
    tfin.value = time(vid.currentTime);
    vid.addEventListener("timeupdate", getEndSegmentTime);
}

// Funcion de cojer el tiempo final.
function getEndSegmentTime(){
    tfin.value = time(vid.currentTime);
}

// Añade un nuevo segmento en el json.
function addSegment(){
    pause();
    if(tini.value < tfin.value){
        if(type == "meta"){
            if(tlat.value != "" && tlon.value != "" && tzoo.value != "" && tdes.value != "") {
                var i = deleteSegment();
        
                var ti = "00:" + tini.value + ".001";
                var tf = "00:" + tfin.value + ".000";
                var tl = tlat.value;
                var tg = tlon.value;
                var tz = tzoo.value;
                var td = '"' + tdes.value + '"';
                json.splice(i, 0, {inicio:ti, fin:tf, latitud:tl, longitud:tg, zoom:tz, descripcion:td});
                document.getElementById("show").innerHTML = showVTT();
            } else {
                window.alert("Introduce metadatos.");
            }
        }else if(type == "sub"){
            if(ttex.value != ""){
                var i = deleteSegment();
        
                var ti = "00:" + tini.value + ".001";
                var tf = "00:" + tfin.value + ".000";
                var tt = ttex.value;
                json.splice(i, 0, {inicio:ti, fin:tf, texto:tt});
                document.getElementById("show").innerHTML = showVTT();
            } else {
                window.alert("Introduce subtitulo.");
            }
        }
    }else{
        window.alert("El inicio no puede ser mayor o igual que el final.")
    }
    
    
}

// Elimina un segmento y actualiza el show.
function removeSegment(){
    deleteSegment();
    document.getElementById("show").innerHTML = showVTT();
}

// Elimina un segmento en el json.
function deleteSegment(){
    pause();
    vid.removeEventListener("timeupdate", getEndSegmentTime);
    var tsi = getseconds(tini.value);
    var tsf = getseconds(tfin.value);
    var tji, tjf;
        
    var found = false;
    var lapedend = false;
    var lapedstart = false;
        
    var i = 0;
    while(!found && i < json.length){
        tji = getsecondsVTT(json[i]["inicio"]);
        if(tji >= tsi){
            found = true;
        } else {
            i++;
        }
    }
    if (found){
        if(tsf > tji){
            tjf = getsecondsVTT(json[i]["fin"]);
            if(tsf >= tjf){
                json.splice(i, 1);
                while(i < json.length && tsf >= getsecondsVTT(json[i]["fin"])){
                    json.splice(i, 1);
                }
                if(i < json.length){
                    tji = getsecondsVTT(json[i]["inicio"]);
                    if(tsf > tji){
                        lapedend = true;
                    }
                }
            } else {
                lapedend = true;
            }
        } 
    }
    if(i > 0){
        tjf = getsecondsVTT(json[i-1]["fin"]);
        if(tsi <= tjf){
            lapedstart = true;
        } 
    }
    if(lapedstart){
        json[i-1]["fin"] = "00:" + tini.value + ".000";
    }
    if(lapedend){
        json[i]["inicio"] = "00:" + tfin.value + ".001";
    }
    return i;
}

// Abre un archivo o crea uno si no hay seleccionados.
function openVTT(){
    file = document.getElementById("selectvtt").value;
    if(file.includes('new')){
        var name = videos[selector.value]["mp4"].substr(0, videos[selector.value]["mp4"].indexOf("."));
        file = file.replace('new', name);
        file += '.vtt';
        if(window.confirm('Nuevo archivo ' + file)){
            writeVTT(file, 'WEBVTT');
            dirVTT();
            $('#selectvtt option:contains(' + file + ')').prop({selected: true});
        } else{
            file = null;
        }
    }
    if(file != null){
        document.getElementById("filename").innerHTML = 'Contenido del archivo ' + file;
        if(file.includes("meta")){
            type = "meta";
        }else{
            type = "sub";
        }
        readVTT(file); 
        setControls();
    }
}

// Elimina el archivo seleccionado en el dropdown.
function deleteVTT(){
    var rem = document.getElementById("selectvtt").value;
    if(rem != '-'){
        if(window.confirm('Seguro que quieres eliminar el archivo ' + rem + '?')){
            $.ajax({
                type: "POST",
                url: '../backend/delete.php',
                async: false,
                data: {"file": rem},
                success: function(value){
                    if(value){
                        window.alert("Archivo eliminado");
                        resetview();
                    } else {
                        window.alert("No se pudo realizar la operacion");
                    }
                }
            });
        } else {
            window.alert("Se cancelo la operacion del archivo");
        }
    }
}

// Muestra los archivos vtt que hay en el servidor relacionados con el video.
function dirVTT(){
    
    var name = videos[selector.value]["mp4"].substr(0, videos[selector.value]["mp4"].indexOf("."));
    
    $.ajax({
            type: "POST",
            url: '../backend/dir.php',
            async: false,
            data: {"name": name},
            success: function(data){
                var dir = JSON.parse(data);
                var s = '';
                for (var i = 0; i < dir.length; i++){
                    s += '<option value="' + dir[i] + '">' + dir[i] + '</option>';
                }
                if(!dir.includes(name + "_es.vtt")){
                    s += '<option value="new_es">nuevo _es.vtt</option>';
                }
                if(!dir.includes(name + "_jp.vtt")){
                    s += '<option value="new_jp">nuevo _jp.vtt</option>';
                }
                if(!dir.includes(name + "_meta.vtt")){
                    s += '<option value="new_meta">nuevo _meta.vtt</option>';
                }
                document.getElementById("selectvtt").innerHTML = s;
            }
    });
}

// Guarda el archivo vtt abierto en ese momento.
function saveVTT(){
    if(file != undefined){
        writeVTT(file, getVTT);
    }
}

// Lee archivo lo guarda en la variable json y muestra por el div show.
function readVTT(name){
    $.ajax({
            type: "POST",
            url: '../backend/read.php',
            data: {"name":name},
            async: false,
            success: function(data){
                json = JSON.parse(data);
            }
    });
    document.getElementById("show").innerHTML = showVTT();
}

// Escribe lo pasado por data al archivo name dentro de la carpeta video.
function writeVTT(name, data){
    $.ajax({
            type: "POST",
            url: '../backend/write.php',
            async: false,
            data: {"name": name, "data": data},
            success: function(){window.alert("Archivo Guardado");}
        });
}

// Devuelve la variable json en string para guardarla en un archivo.
function getVTT(){
    var s = "WEBVTT";
    for (var i = 0; i < json.length; i++){
        var obj = json[i];
        if(type == "meta"){
            s += "\n\n" + obj["inicio"] + " --> " + obj["fin"] + "\n";
            s += "{\n";
            s += '"latitude": '+ obj["latitud"] + ",\n"; 
            s += '"longitude": ' + obj["longitud"] + ",\n"; 
            s += '"zoom": ' + obj["zoom"] + ",\n"; 
            s += '"descripcion": ' + obj["descripcion"] + "\n"; 
            s += "}";
        } else if (type == "sub") {
            s += "\n\n"+ obj["inicio"] + " --> " + obj["fin"] + "\n";
            s += obj["texto"];
        }
    }
    return s;
}

// Devuelve la variable json en html para mostrarla en el div.
function showVTT(){
    var s = "";
    for (var i = 0; i < json.length; i++){
        var obj = json[i];
        if(type == "meta"){
            s += obj["inicio"] + " --> " + obj["fin"] + "<br>";
            s += "latitud: " + obj["latitud"] + "<br>"; 
            s += "longitud: " + obj["longitud"] + "<br>"; 
            s += "zoom: " + obj["zoom"] + "<br>"; 
            s += "descripcion: " + obj["descripcion"] + "<br>"; 
        } else if (type == "sub"){
            s += obj["inicio"] + " --> " + obj["fin"] + "<br>";
            s += obj["texto"] + "<br>"; 
        }       
    }
    return s;
}

function getsecondsVTT(time){
    var min = time.substring(3, 5);
    var sec = time.substring(6, 8);
    return (parseInt(min) * 60) + parseInt(sec);
}

function getseconds(time){
    var min = time.substring(0, 2);
    var sec = time.substring(3);
    return (parseInt(min) * 60) + parseInt(sec);
}

function setControls(){
    if(type == "meta"){
        document.getElementById("controls").innerHTML = '<label>Inicio sengmento:</label>&nbsp<input type="text" readonly id="inicio" value="--:--" style=" width: 100%;padding: 6px 12px;margin: 4px 0;box-sizing: border-box;border: none;background-color: #3CBC8D;color: white;"><br><label>Fin segmento:</label>&nbsp<input type="text" readonly id="fin" value="--:--"style=" width: 100%;padding: 6px 12px;margin: 4px 0;box-sizing: border-box;border: none;background-color: #3CBC8D;color: white;"><br><label>Latitud: </label><input type="text" id="Latitud"style=" width: 100%;padding: 6px 12px;margin: 4px 0;box-sizing: border-box;border: none;background-color: #3CBC8D;color: white;"><br><label>Longitud: </label><input type="text" id="Longitud" style=" width: 100%;padding: 6px 12px;margin: 4px 0;box-sizing: border-box;border: none;background-color: #3CBC8D;color: white;"><br><label>Zoom: </label><input type="text" id="Zoom" style=" width: 100%;padding: 6px 12px;margin: 4px 0;box-sizing: border-box;border: none;background-color: #3CBC8D;color: white;"><br><label>Descripcion: </label><input type="text" id="Descripcion" style=" width: 100%;padding: 6px 12px;margin: 10px 0;box-sizing: border-box;border: none;background-color: #3CBC8D;color: white;"><br><input type="button" class="btn  btn-outline-success me-2 external" id="newseg" onclick="newSegment()" value="Inicio Segmento"><input type="button" class="btn  btn-outline-success me-2 external" id="saveseg" onclick="addSegment()" value="Guardar Segmento"><input type="button" class="btn  btn-outline-success me-2 external" id="clrseg" onclick="removeSegment()" value="Eliminar Segmento">';
        tlat = document.getElementById("Latitud");
        tlon = document.getElementById("Longitud");
        tdes = document.getElementById("Descripcion");
        tzoo = document.getElementById("Zoom");
        tini = document.getElementById("inicio");
        tfin = document.getElementById("fin");
    } else if (type == "sub") {
        document.getElementById("controls").innerHTML = '<label>Inicio segmento:</label>&nbsp<input type="text" readonly id="inicio" value="--:--"style=" width: 100%;padding: 6px 12px;margin: 4px 0;box-sizing: border-box;border: none;background-color: #3CBC8D;color: white;"><br><label>Fin segmento:</label>&nbsp<input type="text" readonly id="fin" value="--:--"style=" width: 100%;padding: 6px 12px;margin: 4px 0;box-sizing: border-box;border: none;background-color: #3CBC8D;color: white;"><br><label>Texto segmento: </label><input type="text" id="texto"style=" width: 100%;padding: 6px 12px;margin: 10px 0;box-sizing: border-box;border: none;background-color: #3CBC8D;color: white;"><br><input type="button" class="btn  btn-outline-success me-2 external" id="newseg" onclick="newSegment()" value="Inicio Segmento"><input type="button" class="btn  btn-outline-success me-2 external" id="saveseg" onclick="addSegment()" value="Guardar Segmento"><input type="button" class="btn  btn-outline-success me-2 external" id="clrseg" onclick="removeSegment()" value="Eliminar Segmento">';
        ttex = document.getElementById("texto");
        tini = document.getElementById("inicio");
        tfin = document.getElementById("fin");
    } else {
        document.getElementById("controls").innerHTML = '';
    }  
}

function changeVideo(){
    setvideo();
    resetview();
}

function resetview(){
    dirVTT();
    document.getElementById("show").innerHTML = '';
    document.getElementById("filename").innerHTML = 'Contenido del archivo';
    json = undefined;
    type = null;
    setControls();
}