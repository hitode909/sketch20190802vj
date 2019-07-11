const from = document.querySelector('#from');
const to = document.querySelector('#to');
const char = document.querySelector('#char');

let i = 0;
const nextEmoji = () => {
    const codes = [from.value.codePointAt(0), to.value.codePointAt(0)].sort((a, b) => a - b);
    const diff = codes[1] - codes[0];
    return String.fromCodePoint(codes[0] + (i++ % (diff+1)));
};

const step = () => {
    char.textContent = nextEmoji();
};

setInterval(() => {
    step();
}, 20)