var e = 2;

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


var playlist_id = 'PLFQyqoDlI0mVZ4coZtJI81ubTFBBOF5Fl';
var API_KEY = 'AIzaSyDnMcUBh513OYpPbHMRL_seUDNAQhDAhck';

var songs = []; //'A3enAoLk3U8', 'dztURk0_DOg'];
var i = 0;
var transmitter;

var API_ROOT = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=' + playlist_id + '&key='
var duration_url = function(ids) {
    var id_joined = ids.join('%2C');
    return 'https://www.googleapis.com/youtube/v3/videos?id=' + id_joined + '&part=contentDetails&key=' + API_KEY;
}

function load_playlist(z) {
    $.get(API_ROOT + API_KEY, {}, function (data) {
        var ids = [];
        for (var i = 0; i < data.items.length; i++) {
            songs.push({id: data.items[i].snippet.resourceId.videoId,
                        title: data.items[i].snippet.title});
            ids.push(data.items[i].snippet.resourceId.videoId);
        }

        $.get(duration_url(ids), {}, function (data2) {
            for (var i = 0;i < data2.items.length; i++) {
                songs[i].duration = parse_iso8601(data2.items[i].contentDetails.duration);
            }
            playlist_now(z);
        }, 'json');

    }, 'json');

}

function parse_iso8601(time) {
    var min = '';
    var sec = '';
    var i = 2;
    while(!isNaN(time[i])) {
        min += time[i];
        i++;
    }
    i++;
    while(!isNaN(time[i])) {
        sec += time[i];
        i++;
    }
    return 60 * parseInt(min) + parseInt(sec);
    //just fuck it
}

FIRST = 1433953821.7

function onYouTubeIframeAPIReady() {
    console.log(songs);
    load_playlist(function(start_time) {
        console.log(songs, start_time);

        transmitter = new YT.Player('transmitter', {
        height: '360',
        width: '640',
        videoId: songs[0].id,
        playerVars: { 'controls': 1, 'start': start_time },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      })});
}



function onPlayerReady(event) {
    if(songs.length == 0) {
        setTimeout(onPlayerReady, 200);
    }
    else {
        event.target.playVideo();
    }
}


function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        i += 1;
        if(i == songs.length) {
            i = 1;
        }
        transmitter.loadVideoById(songs[i].id);
    }
}

function moveVideo() {
    setInterval(function() {
        var t = document.getElementById('transmitter');
        t.style.marginLeft = Math.ceil(Math.random() * 200) + 'px';
        t.style.marginTop = Math.ceil(Math.random() * 200) + 'px';
    }, 20000);
}

function playlist_now(z) {
    var now = new Date().getTime() / 1000;
    if (FIRST > now) { setTimeout(function() { playlist_now(z); }, FIRST - now);}
    var time = FIRST;

    for (var i = 0;i < songs.length; i++) {
        time += songs[i].duration;
        console.log(time, now, songs[i].duration - (time - now));

        if (time > now) {
            songs = songs.slice(i);
            var start_time = Math.floor(songs[0].duration - (time - now));
            z(start_time);
            return;
        }
    }
}

moveVideo();
