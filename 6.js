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

class Tapper {
    constructor(input, tapButton) {
        this.input = input;
        this.tapButton = tapButton;
        this.input.addEventListener('change', () => {
            this.change();
        });
        this.tapButton.addEventListener('mousedown', () => {
            this.tap();
        });
        this.tappedAt = [];
    }
    tap() {
        this.tappedAt.push(new Date().getTime());
        if (this.tappedAt.length > 4) this.tappedAt.shift();
        if (this.tappedAt.length < 2) return;
        let durations = 0;
        for (let i = 0; i < this.tappedAt.length - 1; i++) {
            durations += this.tappedAt[i + 1] - this.tappedAt[i];
        }
        durations /= this.tappedAt.length - 1;
        this.input.value = durations;
        console.log(durations);
    }
    change() {
        console.log('clear');
        this.tappedAt = [];
    }
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

    document.querySelector('#tap').addEventListener('mousedown', observe);
}

new Tapper(
    document.querySelector('input[name="interval"]'),
    document.querySelector('button#tap'),
);
