class Display extends AnimationObjectBase {
    constructor(root) {
        super();
        this.root = root;
        this.$display = $(`<div class='schedule-display'></div>`)
        this.root.$schedule.append(this.$display);

        this.hide();

        this.start();
    }

    start() {

    }

    resize() {
        this.width = this.$display.width();
        this.height = this.$display.height();
        this.scale = this.height;

        if(this.displayBackground) this.displayBackground.resize();
    }

    show() {
        this.displayBackground = new DisplayBackground(this);
        this.resize();

        this.$display.show();
    }

    hide() {
        this.$display.hide();
    }
}
