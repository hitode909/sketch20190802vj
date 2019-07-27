class VolumeAverage {
    constructor() {
        navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioCtx.createAnalyser();
            const source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);
            this.analyser = analyser;
            this.data = new Uint8Array(analyser.frequencyBinCount);
        });
    }
    getVolume() {
        if (!this.data)
            return 0;
        this.analyser.getByteFrequencyData(this.data);
        let sum = 0;
        const length = this.data.length;
        for (var i = 0; i < length; i++) {
            sum += this.data[i];
        }
        return sum / length;
    }
}
