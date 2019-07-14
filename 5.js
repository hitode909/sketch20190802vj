const from = document.querySelector('#from');
const diffInput = document.querySelector('#diff');
const char = document.querySelector('#char');

let i = 0;
const nextEmoji = () => {
    const base = from.value.codePointAt(0);
    const diff = + diffInput.value;
    return String.fromCodePoint(base + (i++ % (diff+1)));
};

const step = () => {
    char.textContent = nextEmoji();
};

setInterval(() => {
    step();
}, 20)