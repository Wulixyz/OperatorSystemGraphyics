class LineProcessGroup extends AnimationObjectBase {
    constructor(root,pos,width,height,mode) {
        super();
        this.root = root;
        this.ctx = this.root.ctx;
        this.mode = mode;
        this.pos = pos;

        this.width = width;
        this.height = height;
        this.scale = this.root.scale;

        this.topLeft = [this.pos[0],this.pos[1] - this.height / 2];
        this.bottomLeft = [this.pos[0],this.pos[1] + this.height / 2];
        this.topRight = [this.pos[0] + this.width,this.pos[1] - this.height / 2];
        this.bottomRight = [this.pos[0] + this.width,this.pos[1] + this.height / 2];
    }

    update() {
        this.render();
    }

    render() {
        this.renderLine();
        this.renderMode();
    }

    renderLine() {
        this.drawLine(this.topLeft,this.topRight);
        this.drawLine(this.topLeft,this.bottomLeft);
        this.drawLine(this.bottomLeft,this.bottomRight);
    }

    renderMode() {
        this.ctx.font = "20px Arial";
        this.ctx.save();
        this.ctx.translate(this.bottomLeft[0] - 0.02 * this.scale,this.bottomLeft[1] - 0.01 * this.scale);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillStyle = "black";
        this.ctx.fillText(this.mode,0,0);
        this.ctx.restore();
    }

    drawLine(pos1,pos2) {
        this.ctx.beginPath();
        this.ctx.moveTo(pos1[0],pos1[1]);
        this.ctx.lineTo(pos2[0],pos2[1]);
        this.ctx.stroke();
    }
}