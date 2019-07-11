const hidden = document.querySelector('.hidden');
const div = document.querySelector('.char');

const emojiAt = (i) => {
    return String.fromCodePoint("😀".codePointAt() + i);
};

let i = 0;
const nextEmoji = () => {
    let code;
    try {
        code = emojiAt(i++);
    } catch (error) {
        i = 0;
        return nextEmoji();
    }
    return code;
};

const step = () => {
    div.textContent = nextEmoji();
    if (hidden.offsetWidth === div.offsetWidth) return step();
};

setInterval(() => {
    step();
}, 20)