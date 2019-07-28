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

const extractVideoId = (input) => {
    const videoId = input.match(/v\=(.+)$/);
    if (videoId) {
        return videoId[1];
    }
    return input;
}

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        videoId: extractVideoId(collectParameters().videoId),
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

    document.querySelectorAll('input.auto').forEach((i) => {
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
    const videoId = extractVideoId(collectParameters().videoId);
    if (videoId !== new URL(player.getVideoUrl()).searchParams.get('v')) {
        document.querySelector('input[name="seekTo"]').value = 0;
        parameters.seekTo = 0;
        player.loadVideoById(videoId, + parameters.seekTo);
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

    document.querySelector('#tap').addEventListener('mousedown', observe);
}

new Tapper(
    document.querySelector('input[name="interval"]'),
    document.querySelector('button#tap'),
);

const videoInput = document.querySelector('input[name="videoId"]');
const videoIdKey = 'videoId';
document.addEventListener('change', () => {
    localStorage.setItem(videoIdKey, videoInput.value);
});
videoInput.value = localStorage.getItem(videoIdKey) || 'Kd-Va1m4s1E';
