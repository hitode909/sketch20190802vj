const extractBody = (keyword, response) => {
    const pages = response.query.pages;
    page = pages[Object.keys(pages)[0]];
    const html = page.revisions[0]['*'];
    const parser = new DOMParser();
    const root = parser.parseFromString(html, 'text/html');
    const lines = [keyword, ...root.body.textContent.split(/\n+/)];
    const links = Array.from(root.body.querySelectorAll('a[href*="/wiki/"]')).map(a => decodeURIComponent(a.href.match(/\/wiki\/(.+)$/)[1]));
    return { title: keyword, lines: lines, links: links };
};

const setupElement = (marquee, title, lines) => {
    const line = lines.shift();
    lines.push(line);
    marquee.textContent = line;
    if (line === title) {
        marquee.style.color = 'red';
    } else {
        marquee.style.color = 'white';
    }
    marquee.scrollAmount = Math.random() * 100 + 50;
    document.body.appendChild(marquee);
};

const fetchKeyword = async (keyword) => {
    return extractBody(keyword, await(await fetch(
        `https://ja.wikipedia.org/w/api.php?format=json&action=query&prop=revisions&titles=${encodeURIComponent(keyword)}&rvprop=content&origin=*&rvparse`
    )).json());
};

const main = async () => {
    let keyword = await fetchKeyword(decodeURIComponent(location.hash).substring(1) || 'モーニング娘。');

    const marquees = [];
    const marqueesSize = 10;
    for (let i = 0; i < marqueesSize; i++) {
        const marquee = document.createElement('marquee');
        marquee.style.fontSize = `${100.0 / marqueesSize}vh`;
        marquees.push(marquee);
        setupElement(marquee, keyword.title, keyword.lines);
    }
    const renew = async () => {
        marquees.forEach((marquee) => {
            if (Math.random() > 0.95) {
                setupElement(marquee, keyword.title, keyword.lines);
                return false;
            }
        });
    };
    const walk = async () => {
        const newKeyword = keyword.links[Math.floor(Math.random() * keyword.links.length)];
        console.log(newKeyword);
        keyword = await fetchKeyword(newKeyword);
    };
    setInterval(renew, 100);
    setInterval(walk, 1000 * 10);
};

main();