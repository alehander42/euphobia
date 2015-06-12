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

var API_ROOT = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=42&playlistId=' + playlist_id + '&key='
var duration_url = function(ids) {
    var id_joined = ids.join('%2C');
    return 'https://www.googleapis.com/youtube/v3/videos?id=' + id_joined + '&part=contentDetails&key=' + API_KEY;
}


FIRST = new Date(2015, 5, 12, 23, 28, 0).getTime() / 1000;
timezone_diff = new Date().getTimezoneOffset() + 120;
FIRST -= 60 * timezone_diff;

function load_playlist(z) {
    $.get(API_ROOT + API_KEY, {}, function (data) {
        var ids = [];
        songs = [];
        for (var i2 = 0; i2 < data.items.length; i2++) {
            console.log(data.items.length);
            songs.push({id: data.items[i2].snippet.resourceId.videoId,
                        title: data.items[i2].snippet.title});
            ids.push(data.items[i2].snippet.resourceId.videoId);
        }

        $.get(duration_url(ids), {}, function (data2) {
            var time = FIRST;
            for (var i2 = 0;i2 < data2.items.length; i2++) {
                
                songs[i2].begin_at = time;
                songs[i2].duration = parse_iso8601(data2.items[i2].contentDetails.duration);
                time += songs[i2].duration;
            }
            z();
        }, 'json');

    }, 'json');

}

function when(i) {
    var date = new Date(songs[i].begin_at * 1000);
    // hours part from the timestamp
    var hours = date.getHours();
    // minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

    // will display time in 10:30:23 format
    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}


function parse_iso8601(time) {
    var min = '';
    var sec = '';
    var i2 = 2;
    while(!isNaN(time[i2])) {
        min += time[i2];
        i2++;
    }
    i2++;
    while(!isNaN(time[i2])) {
        sec += time[i2];
        i2++;
    }
    if(sec == '') { sec = '0' }
    return 60 * parseInt(min) + parseInt(sec);
    //just fuck it
}

function onYouTubeIframeAPIReady() {
    load_playlist(function() { playlist_now(function(start_time) {
        console.log('songs:', songs, start_time);


        setTimeout(reload_playlist, 1000 * (songs[i].begin_at + songs[i].duration - start_time - 12));
        transmitter = new YT.Player('transmitter', {
        height: '360',
        width: '640',
        videoId: songs[i].id,
        playerVars: { 'controls': 0, 'start': start_time },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      })})});
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
        setTimeout(reload_playlist, 1000 * (songs[i].begin_at + songs[i].duration - 12));
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
    console.log(now, FIRST, FIRST - now);
    if (FIRST > now) { setTimeout(function() { playlist_now(z); }, FIRST - now); }
    for(var z2 = 0; z2 < songs.length; z2++) {
        console.log(z2, when(z2), songs[z2].begin_at + songs[z2].duration, now);
        if(songs[z2].begin_at <= now && songs[z2].begin_at + songs[z2].duration > now) {
            var start_time = Math.floor(now - songs[z2].begin_at);
            i = z2;
            z(start_time);
        } 
    }
}

function reload_playlist() {
    load_playlist(function() {
        var next = songs[i].begin_at + songs[i].duration;
        for(var j = 0;j < songs.length; j++) {
            if(songs[j].begin_at <= next  && songs[j].begin_at + songs[j].duration > next) {
                songs[j].begin_at = next;
                i = j;
                for(var l = j + 1;l < songs.length; l++) { songs[l].begin_at += next - songs[j].begin_at }
            }
        }
    });
}


setTimeout(reload_playlist, 20000);
moveVideo();
