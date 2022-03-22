var vid;

window.onload = function() {
vid = document.getElementsByTagName("video")[0]; vid.addEventListener("ended", updateButton, true); vid.addEventListener("play", updateButton, true); updateButton();
  }

function updateButton() {
document.querySelector("#controls .play").style.display = isPlaying(vid) ? "none" : "block";
document.querySelector("#controls .pause").style.display = !isPlaying(vid) ? "none" : "block";
}

function isPlaying(video) {
return (!video.paused && !video.ended);
}

function togglevideo() {
!isPlaying(vid) ? vid.play() : vid.pause(); updateButton();
}