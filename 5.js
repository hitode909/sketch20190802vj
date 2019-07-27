const from = document.querySelector('#from');
const diffInput = document.querySelector('#diff');
const intervalInput = document.querySelector('input[name="interval"]');
const char = document.querySelector('#char');

let i = 0;
let base = from.value.codePointAt(0);
const nextEmoji = () => {
    if (from.value) {
        base = from.value.codePointAt(0);
    }
    const diff = + diffInput.value;
    return String.fromCodePoint(base + (i++ % (diff+1)));
};

new Tapper(
    document.querySelector('input[name="interval"]'),
    document.querySelector('button#tap'),
);

const step = () => {
    setTimeout(() => {
        step();
    }, intervalInput.value);
    char.textContent = nextEmoji();
};

step();

