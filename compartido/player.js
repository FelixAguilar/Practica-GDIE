var videos; // JSON con todos los videos del servidor.
var selector; // selector de videos.
var vid; // Video en reproduccion.
var bar; // Barra de progreso del video.
var svg; // Controles del video.
var timer; // Contador en segundos de cuanto tardarĂ¡ en ocultar los controles.

var contenedor = "player"; //contenedor en el cual se pondrĂ¡ el player.

// Inicia el player en la web por primera vez.
function player_start() {  
    selector = document.getElementById("selectvideo");
    getvideos();
    setvideo();  
}

// Inicia el video correspondiente al parametro con todos los eventos.
function setvideo(){
    
    player(selector.value);
    
    vid = document.getElementsByTagName("video")[0];
    vid.addEventListener("timeupdate", onTimeChange);
    vid.addEventListener("durationchange", onDurationChange);
    vid.addEventListener("ended", updatePlay);
    
    bar = document.getElementById("bar");
    bar.addEventListener("click", onProgressBarClick);
    bar.addEventListener("mousemove", onProgressBarHover);
    
    window.addEventListener("resize", screenButtons);
    
    svg = document.getElementById("svg");
    svg.addEventListener("mousemove", showControls);
    
    screenButtons();
}

// Devuelve un string con el tiempo que se da en segundos.
function time(t){
    
    // Minutos.
    all = t / 60;
    var min = Math.floor(all);
    
    // Segundos.
    all = (all - min) * 60;
    var sec = Math.round(all);
    
    // Cadena a devolver.
    return ("0" + min).slice(-2) + ":" + ("0" + sec).slice(-2);
}

// Cuando la duracion del video cambia, este se actualiza como el maximo de la 
// barra de progreso.
var onDurationChange = function(){
    if(vid.readyState){
        document.getElementById("duration").innerHTML = time(vid.duration);
        document.getElementById("bar").max = vid.duration;
    }
}

// Cuando el tiempo actual del video cambia, este se actualiza junto con la 
// barra de progrso.
var onTimeChange = function(){
    if(vid.readyState){
        document.getElementById("current").innerHTML = time(vid.currentTime);
        document.getElementById("bar").value = Math.round(vid.currentTime);
    }
}

// Devuelve el tiempo en segundos del video en el cual se va saltar segun la 
// posicion del raton dentro de la barra de reproduccion del video.
function jumptime(x){
    var bar_start = bar.getBoundingClientRect().left;
    var bar_end = bar.getBoundingClientRect().right;
    var bar_max = bar.max;     
    var time = (x - bar_start) * bar_max / (bar_end - bar_start);
    if(time <= bar.max){
        return time;
    }
    return -1;  
}

// Cuando se hace click sobre la barra de progreso, este cambia el tiempo 
// actual del vidio al indicado por el segmento.
var onProgressBarClick = function(e){
    var sec = jumptime(e.pageX);
    if(sec > -1){
        vid.currentTime = Math.round(sec);
    }
}

// Cuando el cursor se desplaza por encima muestra el tiempo en el que se va a
// mover si pulsas.
var onProgressBarHover = function(e){ 
    var sec = jumptime(e.pageX);
    if(sec > -1){
        var tooltipSpan = document.getElementById('bar-tooltip-span');
        tooltipSpan.style.top = (e.clientY + 15) + 'px';
        tooltipSpan.style.left = (e.clientX - 25) + 'px';
        tooltipSpan.innerHTML = time(sec);
    }
}

// Coloca los botones en el sitio adecuado del svg para que esten cenntrados.
function screenButtons(){
    var svgY = svg.clientHeight;
    var svgX = svg.clientWidth;
    
    document.getElementById("play").innerHTML = '<path class="play" fill="green" d="M ' + (svgX/2 - 10) + ' ' + (svgY/2 - 15) + ' v 30 l 25 -15 Z"/> <path class="pause" stroke-width="12" stroke="green" d="M '+ (svgX/2 - 10) + ' ' + (svgY/2 - 15) +' v 30 m 16 -30 v 30"/><circle stroke="black" fill="black" fill-opacity="0" stroke-width="12" cx="' + svgX/2 + '" cy="' + svgY/2 + '" r="' + 40 + '" onclick="toggleVideo();"/> ';
    
    document.getElementById("foward").innerHTML = '<path fill="green" d="M ' + (svgX*2/3 + 1) + ' ' + (svgY/2 - 8) + ' v16 l13 -8 z"/><path fill="green" d="M ' + (svgX*2/3 - 11) + ' ' + (svgY/2 - 8) + ' v16 l13 -8 z"/><circle stroke="black" fill="black" fill-opacity="0" stroke-width="6" cx="' + svgX*2/3 + '" cy="' + svgY/2 + '" r="' + 20 + '" onclick="fowardsVideo();"/> ';
    
    
    document.getElementById("back").innerHTML = '<path fill="green" d="M ' + (svgX/3 - 1) + ' ' + (svgY/2 - 8) + ' v16 l-13 -8 z"/><path fill="green" d="M ' + (svgX/3 + 11) + ' ' + (svgY/2 - 8) + ' v16 l-13 -8 z"/><circle stroke="black" fill="black" fill-opacity="0" stroke-width="6" cx="' + svgX/3 + '" cy="' + svgY/2 + '" r="' + 20 + '" onclick="backVideo();"/> ';
    
    updatePlay();
}

// Muestra u oculta los botones interactivos dentro de la panntalla. A los 5 
// segunndos de inactividad del raton los oculta.
function showControls() {
    document.getElementById("play").style.display = "block";
    document.getElementById("foward").style.display = "block";
    document.getElementById("back").style.display = "block";
    
    clearTimeout(timer);
    timer = setTimeout(() => {
        document.getElementById("play").style.display = "none";
        document.getElementById("foward").style.display = "none";
        document.getElementById("back").style.display = "none";
    }, 5000);
}

// Cambia el estado del boton play segun si el video esta pausado o no.
function updatePlay() {
    document.querySelector("#play .play").style.display = isPlaying(vid) ? "none" : "block";
    document.querySelector("#play .pause").style.display = !isPlaying(vid) ? "none" : "block";
}

// Devuelve si se esta reproducciendo o no el video.
function isPlaying(video) {
    return (!video.paused && !video.ended);
}

// Cambia el estado de reproduccion del video segun el estado del mismo.
function toggleVideo() {
    !isPlaying(vid) ? vid.play() : vid.pause(); 
    updatePlay();
}

function pause(){
    if(isPlaying(vid)){
        vid.pause(); 
        updatePlay();
    }
}

// Avanza el video 5 segundos si no puede porque es mayor que la duracion, 
// impone esta ultima.
function fowardsVideo() {
    var t = vid.currentTime + 5;
    if(t <= vid.duration){
        vid.currentTime = t;
    } else {
        vid.currentTime = vid.duration;
    }
}

// Retrocede el video 5 segundos si no puede porque es menor que 0, impone este
// ultimo.
function backVideo() {
        var t = vid.currentTime - 5;
    if(t => 0){
        vid.currentTime = t;
    } else {
        vid.currentTime = 0;
    }
}

// Funcion que aĂ±ade el player con el video indicado por parametro.
function player(idx){
    var s = '<div class="flex-container-col"><div class="outer"><video id="video" autobuffer muted>';
    
    var dir = "../video/";
    s += '<source src="' + dir + videos[idx]["mp4"] + '" type="video/mp4">';
    if(videos[idx]["webm"] != ""){
        s += '<source src="' + dir + videos[idx]["webm"] + '" type="video/webm">';    
    }
    if(videos[idx]["es"] != ""){
        s += '<track label="espaĂ±ol" kind="subtitles" srclang="es" src="' + dir + videos[idx]["es"] + '">';
    }
    if(videos[idx]["jp"] != ""){
        s += '<track label="japones" kind="subtitles" srclang="jp" src="' + dir + videos[idx]["jp"] + '">';
    }
    if(videos[idx]["meta"] != ""){
        s += '<track label="descripcion" kind="metadata" srclang="es" src="' + dir + videos[idx]["meta"] + '">';
    }
    
    s += 'Your browser does not support the video tag</video><svg id="svg" class="screenbuttons" height="270px" width="480px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ><g id="play"></g><g id="back"></g><g id="foward"></g></svg></div><div class="flex-container-row"><div class="flex-cell-text"><span id="current">00:00</span> / <span id="duration">00:00</span></div><div class="flex-cell-full"><div class="bar-tooltip"><progress id="bar" value=0></progress><span id="bar-tooltip-span"></span></div></div></div></div>'
    
    document.getElementById(contenedor).innerHTML = s;
}

// Funcion que recoje los videos de la web y muestra en el select.
function getvideos(){
    $.ajax({
            type: "POST",
            url: '../backend/videos.php',
            data: {"name":name},
            async: false,
            success: function(data){
                videos = JSON.parse(data);
                
                var s = '';
                for (var i = 0; i < videos.length; i++){
                    var name = videos[i]["mp4"].substr(0, videos[i]["mp4"].indexOf("."));
                    s += '<option value="' + i + '">' + name + '</option>'
                }
                selector.innerHTML = s;
            }
    });
}