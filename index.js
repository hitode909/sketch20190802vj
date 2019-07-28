class Animator {
    constructor(screenSelector) {
        this.screen = document.querySelector(screenSelector);
    }

    onFrame() { }
    onBeat() {}
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
        this.text.style.fontSize = volume + 'px';
    }
};

const volume = new VolumeAverage();
const fxs = [
    new Flash('.screen.flash'),
    new MochiText('.screen.mochi-text'),
];

const render = () => {
    const average = volume.getVolume();
    for (let fx of fxs) {
        fx.onFrame(average);
    }
    // mochiText(average);
    // flash.onFrame(average);

    requestAnimationFrame(render);
    // setTimeout(render, 100);
};
render();
