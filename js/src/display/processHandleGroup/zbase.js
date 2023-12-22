class ProcessHandleGroup extends AnimationObjectBase {
    constructor(display,pos,selectMode) {
        super();
        this.display = display;
        this.ctx = this.display.ctx;
        this.processInfoArray = this.display.processInfoArray;
        this.scale = this.display.scale;
        this.power = 0.18;
        this.height = 0.5 * this.scale;
        this.width = 0.36 * this.scale;

        this.pos = pos;
        this.selectMode = selectMode;

        this.completeProcess = new LineProcessGroup(this,[this.pos[0] - this.width / 2,this.pos[1] + 0.15 * this.scale],this.width,0.13 * this.scale,"Completed");
    }

    show() {

    }

    update() {
        this.render();
    }

    render() {
        this.renderBottomLine();
        this.renderTwoSidesLine();
        this.renderBottomMessage();
        this.renderProcessBlock();
    }

    renderBottomLine() {
        this.drawLine(this.pos[0] - this.power * this.scale,this.pos[1],this.pos[0] + this.power * this.scale,this.pos[1]);
    }

    renderBottomMessage() {
        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.fillText(this.selectMode,this.pos[0] - 0.04 * this.scale,this.pos[1] + 0.05 * this.scale);
    }
    
    renderTwoSidesLine() {
        this.drawLine(this.pos[0] - this.power * this.scale,this.pos[1],this.pos[0] - this.power * this.scale,this.pos[1] - 0.5 * this.scale);
        this.drawLine(this.pos[0] + this.power * this.scale,this.pos[1],this.pos[0] + this.power * this.scale,this.pos[1] - 0.5 * this.scale);
    }

    renderProcessBlock() {
        // this.proccessBlock = new ProcessBlock(this,this.pos,[this.pos[0] + this.width,this.pos[1] + this.height]);

    }

    drawLine(x1,y1,x2,y2) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1,y1);
        this.ctx.lineTo(x2,y2);
        this.ctx.stroke();
    }
}