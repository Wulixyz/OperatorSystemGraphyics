class ProcessWaitGroup extends AnimationObjectBase {
    constructor(display) {
        super();
        this.display = display;

        this.ctx = this.display.ctx;
        this.width = this.display.width;
        this.height = this.display.height;
        this.scale = this.display.scale;

        this.groupGraphyics = new LineProcessGroup(this,[0.3 * this.width,0.1 * this.height],0.7 * this.scale,0.1 * this.height,"Waitting");
    }

    render() {
        
    }

    update() {
        this.render();
    }
}