class ProcessWaitGroup extends AnimationObjectBase {
    constructor(display) {
        super();
        this.display = display;

        this.ctx = this.display.ctx;
        this.scale = this.display.scale;
        this.width = 0.7 * this.scale;
        this.height = 0.14 * this.scale;
        this.pos = [0.3 * this.display.width,0.1 * this.display.height];

        this.PBWidth = this.width / 5;
        this.height = this.height;
        this.waitProcessInfo = this.display.processInfoArray;

        this.groupGraphyics = new LineProcessGroup(this,this.pos,this.width,this.height,"Waitting");
    }

    render() {
        
    }

    update() {
        this.render();
    }
}