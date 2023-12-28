class ProcessHandleGroup extends AnimationObjectBase {
    constructor(display,pos,selectMode) {
        super();
        this.display = display;
        this.processRunnerControl = this.display.processRunnerControl;
        this.ctx = this.display.ctx;
        this.scale = this.display.scale;
        this.power = 0.18;
        this.height = 0.5 * this.scale;
        this.width = 0.36 * this.scale;

        this.pos = pos;
        this.selectMode = selectMode;

        this.PBwidth = this.width;
        this.PBheight = this.height / 7;
        this.PBShowCount = 6;
        this.processInfoArray = this.processRunnerControl.getHandleProcessInfo(this.selectMode);
        this.processBlockArray = [];

        this.arcRadius = 20;
    }

    start() {
        this.completeProcessGroup = new ProcessCompleteGroup(this.display,this,[this.pos[0] - this.width / 2,this.pos[1] + 0.15 * this.scale],this.width,0.13 * this.scale);

        let PBpos = [this.pos[0] - this.width / 2,this.pos[1] - this.PBheight / 2];
        for(let i = 0;i < this.PBShowCount;i ++ ) {
            this.processBlockArray.push(new ProcessBlock(this,PBpos,this.PBwidth,this.PBheight));
            PBpos = [PBpos[0],PBpos[1] - this.PBheight];
        }

        this.overflowProcessGroup = new OverflowProcessGroup(this.display,[this.pos[0],PBpos[1] + 0.04 * this.scale],this.PBwidth,this.PBheight,'vertical');

        this.handleProgressBar = new HandleProgressBar(this,[this.pos[0] + 0.21 * this.scale,this.pos[1]],0.01 * this.scale,this.height,this.selectMode);
    }

    update() {
        this.updateProcessInfo();
        this.updateProcessBlockInfo();
        this.updateOverflowProcessGroupShow(this.selectMode);
        this.render();
    }

    updateProcessInfo() {
        this.processInfoArray = this.processRunnerControl.getHandleProcessInfo(this.selectMode);
    }

    updateProcessBlockInfo() {
        for(let i = 0;i < this.PBShowCount;i ++ ) {
            if(i < this.processInfoArray.length) this.processBlockArray[i].changeProcessInfo(this.processInfoArray[i]);
            else this.processBlockArray[i].changeProcessInfo(null);
        }
    }

    updateOverflowProcessGroupShow() {
        if(this.processInfoArray.length > this.PBShowCount) this.overflowProcessGroup.show();
        else this.overflowProcessGroup.hide();
    }

    render() {
        this.renderBottomLine();
        this.renderTwoSidesLine();
        this.renderBottomMessage();
        this.renderArc();
    }

    renderBottomLine() {
        this.drawLine(this.pos[0] - this.power * this.scale + this.arcRadius,this.pos[1],this.pos[0] + this.power * this.scale - this.arcRadius,this.pos[1]);
    }
    
    renderTwoSidesLine() {
        this.drawLine(this.pos[0] - this.power * this.scale,this.pos[1] - this.arcRadius,this.pos[0] - this.power * this.scale,this.pos[1] - this.height);
        this.drawLine(this.pos[0] + this.power * this.scale,this.pos[1] - this.arcRadius,this.pos[0] + this.power * this.scale,this.pos[1] - this.height);
    }

    renderArc() {
        this.ctx.beginPath();

        // 绘制左侧圆弧
        this.ctx.moveTo(this.pos[0] - this.power * this.scale + this.arcRadius, this.pos[1]);
        this.ctx.arcTo(this.pos[0] - this.power * this.scale, this.pos[1], this.pos[0] - this.power * this.scale, this.pos[1] - this.arcRadius, this.arcRadius);

        // 绘制右侧圆弧
        this.ctx.moveTo(this.pos[0] + this.power * this.scale - this.arcRadius, this.pos[1]);
        this.ctx.arcTo(this.pos[0] + this.power * this.scale, this.pos[1], this.pos[0] + this.power * this.scale, this.pos[1] - this.arcRadius, this.arcRadius);

        this.ctx.stroke();
    }

    drawLine(x1,y1,x2,y2) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1,y1);
        this.ctx.lineTo(x2,y2);
        this.ctx.stroke();
    }

    renderBottomMessage() {
        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.fillText(this.selectMode,this.pos[0] - 0.04 * this.scale,this.pos[1] + 0.05 * this.scale);
    }

    on_destroy() {
        this.completeProcessGroup.destroy();
        for(let i = 0;i < this.processBlockArray.length;i ++ ) {
            this.processBlockArray[i].destroy();
        }
        this.overflowProcessGroup.destroy();
        this.handleProgressBar.destroy();
    }
}