const mochi = (level) => {
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
};
const bgcolor = () => {
    const h = (new Date().getTime() / 10) % 360;
    return `hsl(${h}, 100%, 70%)`;
}

const volume = new VolumeAverage();

const body = document.body;
const h1 = document.querySelector('h1');
const render = () => {
    const average = volume.getVolume();
    h1.style.fontSize = average + 'px';
    h1.textContent = mochi(average);
    body.style.backgroundColor = average > 100 ? bgcolor() : 'black';

    requestAnimationFrame(render);
};
render();
