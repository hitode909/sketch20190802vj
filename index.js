class VolumeAverage {
    constructor() {
        navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioCtx.createAnalyser();
            const source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);
            this.analyser = analyser;
            this.data = new Uint8Array(analyser.frequencyBinCount);
        });
    }
    getVolume() {
        if (!this.data)
            return 0;
        this.analyser.getByteFrequencyData(this.data);
        let sum = 0;
        const length = this.data.length;
        for (var i = 0; i < length; i++) {
            sum += this.data[i];
        }
        return sum / length;
    }
}

class Tapper {
    constructor(input, tapButton, controller) {
        this.input = input;
        this.tapButton = tapButton;
        this.controller = controller;
        this.input.addEventListener('change', () => {
            this.change();
        });
        this.tapButton.addEventListener('mousedown', () => {
            this.tap();
        });
        this.tappedAt = [];
        this.fxs = [];
        this.i = 0;
    }
    setFxs(fxs) {
        this.fxs = fxs;
        this.onBeatCallbacks();
    }
    tap() {
        this.onBeatCallbacks();
        this.calculate();
    }
    onBeatCallbacks() {
        this.i++;
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
            this.onBeatCallbacks();
        }, tapper.input.value);
        const parameters = this.controller.collectParameters();
        for (let fx of this.fxs) {
            fx.onBeatTogggleDisplay(parameters, this.i);
            if (fx.isActive) fx.onBeat();
        }

    }
    calculate() {
        this.tappedAt.push(new Date().getTime());
        if (this.tappedAt.length > 4)
            this.tappedAt.shift();
        if (this.tappedAt.length < 2)
            return;
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

class Controller {
    constructor() {
        this.inputs = document.querySelectorAll('input');

        this.inputs.forEach(input => {
            input.addEventListener('change', () => {
                input.title = input.value;
                this.onParametersChange();
            });
        })
        this.fxs = [];
    }
    setFxs(fxs) {
        this.fxs = fxs;
        this.onParametersChange();
    }

    onParametersChange() {
        const parameters = this.collectParameters();
        for (let fx of this.fxs) {
            // fx.onParametersChangeTogggleDisplay(parameters);
            if (fx.isActive) fx.onParametersChange(parameters);
        }
    }

    collectParameters() {
        const result = {};
        for ( let i of this.inputs) {
            if (i.type === 'checkbox') {
                result[i.name] = i.checked;
            } else {
                result[i.name] = i.value;
            }
        }
        return result;
    }
}
const controller = new Controller();

class Animator {
    constructor(screenName) {
        this.screenName = screenName;
        this.screen = document.querySelector(`.screen.${screenName}`);
        this.isActive = false;
    }

    onFrame() { }
    onBeat() { }
    onBeatTogggleDisplay(parameters, i) {
        const screenKey = `display-${this.screenName}-${i % 4}`;
        this.isActive = parameters[screenKey];
        this.screen.classList.toggle('hidden', ! this.isActive);
    }
    onParametersChange(parameters) { }
}

class Flash extends Animator {
    flash() {
        const h = (new Date().getTime()) % 360;
        return `hsl(${h}, 100%, 70%)`;
    }

    onFrame(volume) {
        this.screen.style.backgroundColor = volume > 30 ? this.flash() : 'transparent';
    }
}

class MochiText extends Animator {
    constructor(selector) {
        super(selector);
        this.text = this.screen.querySelector('.text');
    }
    mochi(level) {
        let result = ['D', 'J', ' '];
        let chars = ['モ', 'チ'];
        // if (Math.random() > 0.5) {
        //     chars.push(chars.shift());
        // }
        for (let i = 0; i < level; i += 5) {
            result.push(chars[0]);
            chars.push(chars.shift());
        }
        if (result[result.length] == 'モ') {
            result.push('チ');
        }
        result.push('モッチ');
        return result.join('');
    }

    onFrame(volume) {
        this.text.textContent = this.mochi(volume);
        this.text.style.fontSize = volume + 'vh';
    }
};

class Shirts extends Animator {
    constructor(selector) {
        super(selector);
        this.img = this.screen.querySelector('.img');
        this.images = [
            "https://teeparty.jp/upload/save_image/10496.jpg", "https://teeparty.jp/upload/save_image/10494.jpg", "https://teeparty.jp/upload/save_image/10493.jpg", "https://teeparty.jp/upload/save_image/10492.jpg", "https://teeparty.jp/upload/save_image/10490.jpg", "https://teeparty.jp/upload/save_image/10488.jpg", "https://teeparty.jp/upload/save_image/10487.jpg", "https://teeparty.jp/upload/save_image/10486.jpg", "https://teeparty.jp/upload/save_image/10485.jpg", "https://teeparty.jp/upload/save_image/10481.jpg", "https://teeparty.jp/upload/save_image/10480.jpg", "https://teeparty.jp/upload/save_image/10476.jpg", "https://teeparty.jp/upload/save_image/10475.jpg", "https://teeparty.jp/upload/save_image/10474.jpg", "https://teeparty.jp/upload/save_image/9639.jpg", "https://teeparty.jp/upload/save_image/9638.jpg", "https://teeparty.jp/upload/save_image/9637.jpg", "https://teeparty.jp/upload/save_image/9636.jpg", "https://teeparty.jp/upload/save_image/9635.jpg", "https://teeparty.jp/upload/save_image/9634.jpg", "https://teeparty.jp/upload/save_image/9633.jpg", "https://teeparty.jp/upload/save_image/9632.jpg", "https://teeparty.jp/upload/save_image/9631.jpg", "https://teeparty.jp/upload/save_image/9630.jpg", "https://teeparty.jp/upload/save_image/9629.jpg", "https://teeparty.jp/upload/save_image/9628.jpg", "https://teeparty.jp/upload/save_image/9600.jpg", "https://teeparty.jp/upload/save_image/9599.jpg", "https://teeparty.jp/upload/save_image/9598.jpg", "https://teeparty.jp/upload/save_image/9597.jpg", "https://teeparty.jp/upload/save_image/9596.jpg", "https://teeparty.jp/upload/save_image/9595.jpg", "https://teeparty.jp/upload/save_image/9594.jpg", "https://teeparty.jp/upload/save_image/9591.jpg", "https://teeparty.jp/upload/save_image/9589.jpg", "https://teeparty.jp/upload/save_image/9587.jpg", "https://teeparty.jp/upload/save_image/9586.jpg", "https://teeparty.jp/upload/save_image/9585.jpg", "https://teeparty.jp/upload/save_image/9583.jpg", "https://teeparty.jp/upload/save_image/9582.jpg", "https://teeparty.jp/upload/save_image/9581.jpg", "https://teeparty.jp/upload/save_image/9580.jpg", "https://teeparty.jp/upload/save_image/9579.jpg", "https://teeparty.jp/upload/save_image/7278.jpg", "https://teeparty.jp/upload/save_image/7277.jpg", "https://teeparty.jp/upload/save_image/5055.jpg", "https://teeparty.jp/upload/save_image/4890.jpg", "https://teeparty.jp/upload/save_image/4889.jpg", "https://teeparty.jp/upload/save_image/4888.jpg", "https://teeparty.jp/upload/save_image/4887.jpg", "https://teeparty.jp/upload/save_image/4560.jpg", "https://teeparty.jp/upload/save_image/4559.jpg", "https://teeparty.jp/upload/save_image/4417.jpg", "https://teeparty.jp/upload/save_image/4416.jpg"
        ];
    }

    onBeat() {
        const image = this.images[Math.floor(this.images.length * Math.random())];
        this.img.src = image;
    }
}

class Emoji extends Animator {
    constructor(selector) {
        super(selector);
        this.text = this.screen.querySelector('.text');
        this.i = 0;
    }

    onParametersChange(parameters) {
        if (parameters['emoji-start']) {
            this.base = parameters['emoji-start'].codePointAt(0);
        }
        this.range = + parameters['emoji-range'];
        this.length = + parameters['emoji-length'];
    }

    nextEmoji() {
        return String.fromCodePoint(this.base + (this.i++ % (this.range+1)));
    }

    onBeat() {
        const parameters = controller.collectParameters();
        this.onParametersChange(parameters);
        const emoji = this.nextEmoji();
        let content = '';
        for (let i = 0; i < this.length; i++) {
            content += emoji;
        }
        this.text.textContent = content;
    }

    onFrame(volume) {
        this.text.style.fontSize = volume * 3 + 'vh';
    }
}

class Giphy extends Animator {
    constructor(selector) {
        super(selector);
        this.i = 0;
        this.imgElement = this.screen.querySelector('img');
    }

    onParametersChange(parameters) {
        const query = parameters['giphy-query'];
        if (query && this.query !== query) {
            this.query = query;
            this.search(query);
        }
    }

    async search(query) {
        const API_KEY = 'LBAjpMNw9QePkkxmlrN3LP3qD9m1qlBz';
        const response = await (await fetch(`https://api.giphy.com/v1/stickers/search?q=${encodeURIComponent(this.query)}&api_key=${API_KEY}&limit=50`)).json();
        this.images = response.data.map(item => {
            return item.images.downsized_large.url;
        });
    }

    nextImage() {
        if (!this.images) return;
        return this.images[this.i++ % (this.images.length + 1)];
    }

    onBeat() {
        const parameters = controller.collectParameters();
        this.onParametersChange(parameters);
        const url = this.nextImage();
        if (parameters['giphy-blink']) {
            const hidden = this.i % 2;
            this.imgElement.classList.toggle('hidden', hidden);
            if (hidden) return;
        }
        if (url) {
            this.imgElement.src = url;
        }
    }
}

class YouTube extends Animator {
    onIframeAPIReady() {
        this.player = new YT.Player('youtube-video', {
            videoId: this.extractVideoId(controller.collectParameters().videoId),
            playerVars: {
                origin: location.protocol + '//' + location.hostname + "/",
                enablejsapi: 1,
                controls: 0,
            },
            events: {
                'onReady': () => { this.onPlayerReady() },
            }
        });
    }
    onPlayerReady(event) {
        this.player.setVolume(0);
        // this.observe();
        // document.querySelector('#tap').addEventListener('mousedown', observe);
    }
    onBeat () {
        const parameters = controller.collectParameters();
        const player = this.player;
        if (!player) return;
        document.querySelector('input[name="seekTo"]').max = player.getDuration();
        const videoId = this.extractVideoId(parameters.videoId);
        if (videoId !== new URL(player.getVideoUrl()).searchParams.get('v')) {
            document.querySelector('input[name="seekTo"]').value = 0;
            parameters.seekTo = 0;
            player.loadVideoById(videoId, + parameters.seekTo);
        }

        this.autoMode();
        player.seekTo(+ parameters.seekTo);
        player.setPlaybackRate(+ parameters.playbackRate);
        player.playVideo();
    };

    autoMode() {
        const parameters = controller.collectParameters();
        if (!parameters.autoMode) return;
        if (Math.random() > 0.3) return;

        document.querySelectorAll('input.auto').forEach((i) => {
            i.value = Math.random() * i.max;
        });
    }
    extractVideoId(input) {
        const videoId = input.match(/v\=(.+)$/);
        if (videoId) {
            return videoId[1];
        }
        return input;
    }
}

const youtube = new YouTube('youtube');

function onYouTubeIframeAPIReady() {
    youtube.onIframeAPIReady();
}

const volume = new VolumeAverage();
const tapper = new Tapper(
    document.querySelector('input[name="interval"]'),
    document.querySelector('button#tap'),
    controller,
);
const fxs = [
    new Flash('flash'),
    new MochiText('dj-name'),
    new Shirts('shirts'),
    new Emoji('emoji'),
    new Giphy('giphy'),
    youtube,
];
controller.setFxs(fxs);
tapper.setFxs(fxs);

const render = () => {
    const average = volume.getVolume();
    for (let fx of fxs) {
        if (fx.isActive) fx.onFrame(average);
    }

    requestAnimationFrame(render);
};
render();
