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
            fx.onParametersChangeTogggleDisplay(parameters);
            fx.onParametersChange(parameters);
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
    }

    onFrame() { }
    onBeat() { }
    onParametersChange(parameters) { }
    onParametersChangeTogggleDisplay(parameters) {
        const screenKey = `display-${this.screenName}`;
        this.screen.classList.toggle('hidden', !parameters[screenKey]);
    }
}

class Flash extends Animator {
    flash() {
        const h = (new Date().getTime()) % 360;
        return `hsl(${h}, 100%, 70%)`;
    }

    onFrame(volume) {
        this.screen.style.backgroundColor = volume > 50 ? this.flash() : 'transparent';
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

const volume = new VolumeAverage();
const tapper = new Tapper(
    document.querySelector('input[name="interval"]'),
    document.querySelector('button#tap'),
);
const fxs = [
    new Flash('flash'),
    new MochiText('dj-name'),
    new Shirts('shirts'),
    new Emoji('emoji'),
];
controller.setFxs(fxs);

const render = () => {
    const average = volume.getVolume();
    for (let fx of fxs) {
        fx.onFrame(average);
    }

    requestAnimationFrame(render);
};
render();

const onBeat = () => {
    setTimeout(() => {
        onBeat();
    }, tapper.input.value);
    for (let fx of fxs) {
        fx.onBeat();
    }
};

onBeat();