class Tapper {
    constructor(input, tapButton) {
        this.input = input;
        this.tapButton = tapButton;
        this.input.addEventListener('change', () => {
            this.change();
        });
        this.tapButton.addEventListener('mousedown', () => {
            this.tap();
        });
        this.tappedAt = [];
    }
    tap() {
        this.tappedAt.push(new Date().getTime());
        if (this.tappedAt.length > 4)
            this.tappedAt.shift();
        if (this.tappedAt.length < 2)
            return;
        let durations = 0;
        for (let i = 0; i < this.tappedAt.length - 1; i++) {
            durations += this.tappedAt[i + 1] - this.tappedAt[i];
        }
        durations /= this.tappedAt.length - 1;
        this.input.value = durations;
        console.log(durations);
    }
    change() {
        console.log('clear');
        this.tappedAt = [];
    }
}
