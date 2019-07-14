const inputs = document.querySelectorAll('input');

const collectParameters = () => {
    const result = {};
    inputs.forEach(i => {
        if (i.type === 'checkbox') {
            result[i.name] = i.checked;
        } else {
            result[i.name] = i.value;
        }
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

const autoMode = () => {
    const parameters = collectParameters();
    if (!parameters.autoMode) return;
    if (Math.random() > 0.3) return;

    document.querySelectorAll('input[type="range"]').forEach((i) => {
        i.value = Math.random() * i.max;
    });
};

let timer;
const observe = () => {
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
    document.querySelector('input[name="seekTo"]').max = player.getDuration();
    const parameters = collectParameters();
    if (parameters.videoId !== new URL(player.getVideoUrl()).searchParams.get('v')) {
        player.loadVideoById(parameters.videoId, + parameters.seekTo);
    }

    autoMode();
    player.seekTo(+ parameters.seekTo);
    player.setPlaybackRate(+ parameters.playbackRate);
    player.playVideo();

    timer = setTimeout(observe, + parameters.interval);
};

function onPlayerReady(event) {
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

