class ProcessWaitGroup extends AnimationObjectBase {
    constructor(display) {
        super();
        this.display = display;

        this.ctx = this.display.ctx;
        this.scale = this.display.scale;
        this.width = 0.7 * this.scale;
        this.height = 0.14 * this.scale;
        this.pos = [0.3 * this.display.width,0.1 * this.display.height];

        this.groupGraphyics = new LineProcessGroup(this,this.pos,this.width,this.height,"Waitting");
        this.processBlock = new ProcessBlock(this,[this.pos[0],this.pos[1] - this.height / 2],[this.pos[0] + this.width,this.pos[1] + this.height / 2]);
    }

    render() {
        
    }

    update() {
        this.render();
    }
}