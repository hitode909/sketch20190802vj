var map;
function initMap() {
    var initialCenter = { lat: 35.0036138, lng: 135.7705486 };
    var center = JSON.parse(JSON.stringify(initialCenter));
    var map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 14,
        // disableDefaultUI: true,
    });
    var panorama = new google.maps.StreetViewPanorama(
        document.getElementById('pano'), {
            position: center,
            // pov: {
            //     heading: 34,
            //     pitch: 10
            // },
            zoom: 0,
            // disableDefaultUI: true,
        });
    map.setStreetView(panorama);

    setInterval(() => {
        if (panorama.getStatus() !== 'OK') {
            // location.reload();
        }
        const speed = 1;
        center.lat += Math.random() * speed - speed / 2;
        center.lng += Math.random() * speed - speed / 2;
        panorama.setPosition(center);
        map.setCenter(center);
    }, 4000);

    // setInterval(() => {
    //     const pov = panorama.getPov();
    //     pov.heading = (new Date().getTime() / 50.0) % 360;
    //     pov.pitch = Math.sin(new Date().getTime() / 1000.0) * 30;
    //     panorama.setPov(pov);
    // }, 40);
}