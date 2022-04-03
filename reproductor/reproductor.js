
var vid;
var tracks;
var sub = null;

window.onload = function(){
    player_start();
    reproductor_start();
    
}
    
function reproductor_start(){
    vid = document.getElementsByTagName("video")[0];
    tracks = vid.textTracks;
    
    var i = 0;
    while(tracks[i].kind != 'metadata'){
        i++;
    }
    tracks[i].mode = "hidden";
    tracks[i].addEventListener("cuechange", metadata);
}

function metadata(){
    var cue = this.activeCues[0];
    var obj = JSON.parse(cue.text);
    document.getElementById("descrip").innerHTML = obj['descripcion'];
    setmap(obj['latitude'], obj['longitude'])
}

function setmap(lat, lon){
    document.getElementById("map").innerHTML = '<iframe src="https://maps.google.com/maps?q=' + lat + ',' + lon + '&z=15&output=embed" frameborder="0" style="width:100%; height:500px;overflow:auto;"></iframe>'
}

function subtitulo_es(){
    subtitulos('es');
}

function subtitulo_jp(){
    subtitulos('jp');
}

function subtitulos(leng){
    if (sub == leng){
        sub = null;
        for (var i = 0; i < tracks.length; i++) {
            var track = tracks[i];
            if (track.kind === 'subtitles') {
                track.mode = 'hidden';
            }
        }
    } else {
        for (var i = 0; i < tracks.length; i++) {
        var track = tracks[i];

        // Find the English captions track and mark it as "showing".
        if (track.kind === 'subtitles' && track.language === leng) {
            track.mode = 'showing';
        } else if (track.kind === 'subtitles') {
            track.mode = 'hidden';
        }
    }
        sub = leng;
    }
    
}

function togglemute(){
    if(vid.muted){
        vid.muted = false;
        document.getElementById("auEsp").value = "Con Volumen";
    } else {
        vid.muted = true;
        document.getElementById("auEsp").value = "Sin Volumen";
    }
}