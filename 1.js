const mochi = (level) => {
    let result = ['D', 'J', ' '];
    let chars = ['モ', 'チ'];
    if (Math.random() > 0.5) {
        chars.push(chars.shift());
    }
    for (let i = 0; i < level; i += 5) {
        result.push(chars[0]);
        chars.push(chars.shift());
    }
    if (result[result.length] == 'モ') {
        result.push('チ');
    }
    result.push('モッチ');
    return result.join('');
};
const bgcolor = () => {
    const h = (new Date().getTime() / 10) % 360;
    return `hsl(${h}, 100%, 70%)`;
}

navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);

    let volume = 1.0;
    const body = document.body;
    const h1 = document.querySelector('h1');
    const render = () => {
        analyser.getByteFrequencyData(data);
        let sum = 0;
        for (var i = 0; i < data.length; i++) {
            sum += data[i];
        }
        const average = sum / data.length;
        h1.style.fontSize = average + 'px';
        h1.textContent = mochi(average);
        body.style.backgroundColor = bgcolor();

        requestAnimationFrame(render);
    };
    render();
});