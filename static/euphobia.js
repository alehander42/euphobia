var e = 2;

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


var songs = ['A3enAoLk3U8', 'dztURk0_DOg'];
var i = 0;
var transmitter;
function onYouTubeIframeAPIReady() {
    transmitter = new YT.Player('transmitter', {
    height: '360',
    width: '640',
    videoId: songs[0],
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}



function onPlayerReady(event) {
    event.target.playVideo();
}


function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        i += 1;
        if(i == songs.length) {
            i = 1;
        }
        transmitter.loadVideoById(songs[i]);
    }
}

function moveVideo() {
    setInterval(function() {
        var t = document.getElementById('transmitter');
        t.style.marginLeft = Math.ceil(Math.random() * 200) + 'px';
        t.style.marginTop = Math.ceil(Math.random() * 200) + 'px';
    }, 20000);
}



moveVideo();

