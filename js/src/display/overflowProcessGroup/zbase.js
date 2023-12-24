class OverflowProcessGroup extends AnimationObjectBase {
    constructor(display,pos,width,height,mode) {
        super();
        this.display = display;
        this.ctx = this.display.ctx;
        this.scale = this.display.scale;
        this.pos = pos;
        this.width = width;
        this.height = height;
        this.mode = mode;

        this.isShow = false;
    }

    start() {

    }

    render() {
        if(this.mode === "line") {
            this.ctx.font = "40px Arial";
            this.ctx.fillStyle = "black";
            this.ctx.fillText(". . .",this.pos[0],this.pos[1]);
        } else if(this.mode === "vertical") {
            this.ctx.font = "40px Arial";
            this.ctx.save();
            this.ctx.translate(this.pos[0],this.pos[1]);
            this.ctx.rotate(-Math.PI / 2);
            this.ctx.fillStyle = "black";
            this.ctx.fillText(". . .",0,0);
            this.ctx.restore();
        }
    }

    update() {
        if(this.isShow) {
            this.render();
        }
    }

    show() {
        this.isShow = true;
    }

    hide() {
        this.isShow = false;
    }
}