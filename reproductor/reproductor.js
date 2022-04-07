var tracks; // Pistas del video en reproduccion.
var sub = null; // Indica que subtitulos se estan usando.

// Se ejecuta al inicio y carga el player y las pistas.
window.onload = function(){
    player_start();
    settracks(); 
}

// Actualiza la lista de las pistas y inicia metadatos si hay.
function settracks(){
    tracks = vid.textTracks;
    var i = 0;
    while(i < tracks.length && tracks[i].kind != 'metadata'){
        i++;
    }
    if(i < tracks.length){
        tracks[i].mode = "hidden";
        tracks[i].addEventListener("cuechange", metadata);
    }
}

// Funcion que muestra los metadatos en las zonas indicadas.
function metadata(){
    var cue = this.activeCues[0];
    var obj = JSON.parse(cue.text);
    document.getElementById("descrip").innerHTML = obj['descripcion'];
    setmap(obj['latitude'], obj['longitude'], obj['zoom']);
}

// Crea el mapa en las coordenadas indicadas por parametro.
function setmap(lat, lon, zoom){
    document.getElementById("map").innerHTML = '<iframe src="https://maps.google.com/maps?q=' + lat + ',' + lon + '&z=' + zoom + '&output=embed" frameborder="0" style="width:100%; height:500px;overflow:auto;"></iframe>'
}

// Cambia los subtitulos a español.
function subtitulo_es(){
    subtitulos('es');
}

// Cambia el subtitulos a japones.
function subtitulo_jp(){
    subtitulos('jp');
}

// Funcion que cambia los subtitulos segun parametro.
function subtitulos(leng){
    
    // Si el lenguaje activo es igual al parametro entonces quita todos los subtitulos.
    if (sub == leng){
        sub = null;
        for (var i = 0; i < tracks.length; i++) {
            var track = tracks[i];
            if (track.kind === 'subtitles') {
                track.mode = 'hidden';
            }
        }
    } else {
        // Si no es asi activa el subtitulo de parametro y oculta los demas.
        for (var i = 0; i < tracks.length; i++) {
            var track = tracks[i];

            if (track.kind === 'subtitles' && track.language === leng) {
                track.mode = 'showing';
            } else if (track.kind === 'subtitles') {
                track.mode = 'hidden';
            }
        }
        sub = leng;
    }   
}

// Comuta el audio entre muteado o reproducciendo.
function togglemute(){
    if(vid.muted){
        vid.muted = false;
        document.getElementById("auEsp").value = "Con Volumen";
    } else {
        vid.muted = true;
        document.getElementById("auEsp").value = "Sin Volumen";
    }
}

// Cambia el video que se muestra.
function changeVideo(){
    setvideo(); // Funcion de player.
    settracks();
    sub = null; // Asegura que no tenga subtitulos activos.
    vid.muted = true; // Asegura que inicie sin sonido.
    document.getElementById("auEsp").value = "Sin Volumen"; 
}