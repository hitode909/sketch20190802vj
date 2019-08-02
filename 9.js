

const main = async () => {
    const API_KEY = 'LBAjpMNw9QePkkxmlrN3LP3qD9m1qlBz';
    const q = 'jump';
    const response = await (await fetch(`https://api.giphy.com/v1/stickers/search?q=${encodeURIComponent(q)}&api_key=${API_KEY}&limit=50`)).json();
    for (let item of response.data) {
        const img = new Image();
        img.src = item.images.downsized_large.url;
        document.body.appendChild(img);
    }
};

main();