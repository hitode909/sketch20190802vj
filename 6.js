const inputs = document.querySelectorAll('input');

const collectParameters = () => {
    const result = {};
    inputs.forEach(i => {
        result[i.name] = i.value;
    });
    return result;
}

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        videoId: collectParameters().videoId,
        playerVars: {
            origin: location.protocol + '//' + location.hostname + "/",
            enablejsapi: 1,
            controls: 0,
        },
        events: {
            'onReady': onPlayerReady,
        }
    });
}

let timer;
const observe = () => {
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
    const parameters = collectParameters();
    if (parameters.videoId !== new URL(player.getVideoUrl()).searchParams.get('v')) {
        player.loadVideoById(parameters.videoId, + parameters.seekTo);
    }
    player.seekTo(+ parameters.seekTo);
    player.setPlaybackRate(+ parameters.playbackRate);
    player.playVideo();

    timer = setTimeout(observe, + parameters.interval);
};

function onPlayerReady(event) {
    document.querySelector('input[name="seekTo"]').max = player.getDuration();
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            observe();
            input.title = input.value;
        });
    })

    player.setVolume(0);
    observe();

    document.querySelector('#sync').addEventListener('mousedown', observe);
}
