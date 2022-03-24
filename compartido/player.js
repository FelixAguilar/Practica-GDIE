var vid; // Video.
var bar; // Barra de progreso del video.
var svg; // Controles del video.
var timer; // Contador en segundos de cuanto tardará en ocultar los controles.

// Variable que añade el source y tipo de video, formato de este es:
// [src1,type1],
// [src2,type2]
var videos = [
    ["../video/Japon4k24nanf.mp4","video/mp4"]
];
var contenedor = "player";

window.onload = function () {
    
    player(contenedor);
    
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
        var tooltipSpan = document.getElementById('tooltip-span');
        tooltipSpan.style.top = (e.clientY + 15) + 'px';
        tooltipSpan.style.left = (e.clientX - 25) + 'px';
        tooltipSpan.innerHTML = time(sec);
    }
}

// Coloca los botones en el sitio adecuado del svg para que esten cenntrados.
function screenButtons(){
    var svgY = svg.getBoundingClientRect().bottom;
    var svgX = svg.getBoundingClientRect().right;
    
    document.getElementById("play").innerHTML = '<path class="play" fill="black" d="M ' + (svgX/2 - 10) + ' ' + (svgY/2 - 15) + ' v 30 l 25 -15 Z"/> <path class="pause" stroke-width="12" stroke="black" d="M '+ (svgX/2 - 10) + ' ' + (svgY/2 - 15) +' v 30 m 16 -30 v 30"/><circle stroke="black" fill="transparent" fill-opacity="0" stroke-width="12" cx="' + svgX/2 + '" cy="' + svgY/2 + '" r="' + 40 + '" onclick="toggleVideo();"/> ';
    
    document.getElementById("foward").innerHTML = '<path fill="black" d="M ' + (svgX*2/3 + 1) + ' ' + (svgY/2 - 8) + ' v16 l13 -8 z"/><path fill="black" d="M ' + (svgX*2/3 - 11) + ' ' + (svgY/2 - 8) + ' v16 l13 -8 z"/><circle stroke="black" fill="transparent" fill-opacity="0" stroke-width="6" cx="' + svgX*2/3 + '" cy="' + svgY/2 + '" r="' + 20 + '" onclick="fowardsVideo();"/> ';
    
    
    document.getElementById("back").innerHTML = '<path fill="black" d="M ' + (svgX/3 - 1) + ' ' + (svgY/2 - 8) + ' v16 l-13 -8 z"/><path fill="black" d="M ' + (svgX/3 + 11) + ' ' + (svgY/2 - 8) + ' v16 l-13 -8 z"/><circle stroke="black" fill="transparent" fill-opacity="0" stroke-width="6" cx="' + svgX/3 + '" cy="' + svgY/2 + '" r="' + 20 + '" onclick="backVideo();"/> ';
    
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

// Funcion que añade el player al contenedor indicado por parametro.
function player(div){
    var s = '<div class="flex-container-col"><div><video id="video" autobuffer muted>';
    
    for(v of videos){
        s += '<source src="' + v[0] + '" type="' + v[1] + '">';
    }
    
    s += 'Your browser does not support the video tag</video><svg id="svg" class="screenbuttons" height="270px" width="480px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ><g id="play"></g><g id="back"></g><g id="foward"></g></svg></div><div class="flex-container-row"><div class="flex-cell-text"><span id="current">00:00</span> / <span id="duration">00:00</span></div><div class="flex-cell-full"><div class="tooltip"><progress id="bar" value=0></progress><span id="tooltip-span"></span></div></div></div></div>'
    
    document.getElementById(div).innerHTML = s;
}