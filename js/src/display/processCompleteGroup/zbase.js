class ProcessCompleteGroup extends AnimationObjectBase {
    constructor(display,root,pos,width,height) {
        super();
        this.display = display;
        this.root = root;
        this.selectMode = this.root.selectMode;
        this.processRunnerControl = this.display.processRunnerControl;
        this.ctx = this.display.ctx;
        this.pos = pos;
        this.width = width;
        this.height = height;
        this.scale = this.display.scale;

        this.PBwidth = this.width / 4;
        this.PBheight = this.height;
        this.PBShowCount = 3;
        this.processInfoArray = this.processRunnerControl.getCompleteProcessInfo(this.selectMode);
        this.processBlockArray = [];
        this.lastCompleteProcess = null;
    }

    start() {
        this.groupGraphyics = new LineProcessGroup(this,this.pos,this.width,this.height,"Completed");

        let PBpos = this.pos;
        for(let i = 0;i < this.PBShowCount;i ++ ) {
            this.processBlockArray.push(new ProcessBlock(this,PBpos,this.PBwidth,this.PBheight));
            PBpos = [PBpos[0] + this.PBwidth,PBpos[1]];
        }

        this.overflowProcessGroup = new OverflowProcessGroup(this.display,PBpos,this.PBWidth,this.PBheight,'line');
    }

    update() {
        this.updateProcessInfo();
        this.updateProcessBlockInfo();
        this.updateOverflowProcessGroupShow();
        this.updateProcessIn();
        this.render();
    }

    updateProcessInfo() {
        this.processInfoArray = this.processRunnerControl.getCompleteProcessInfo(this.selectMode);
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

    updateProcessIn() {
        if(this.processInfoArray[this.processInfoArray.length - 1] != null) {
            if(this.lastCompleteProcess == null || this.lastCompleteProcess['processName'] != this.processInfoArray[this.processInfoArray.length - 1]['processName']) {
                new MoveProcessBlock(this,[this.pos[0],this.pos[1] - 0.15 * this.scale],this.pos,this.root.PBwidth,this.root.PBheight,this.processInfoArray[this.processInfoArray.length - 1]);
                this.lastCompleteProcess = this.processInfoArray[this.processInfoArray.length - 1];
            }
        }
    }

    on_destroy() {
        this.groupGraphyics.destroy();
        for(let i = 0;i < this.processBlockArray.length;i ++ ) {
            this.processBlockArray[i].destroy();
        }
        this.overflowProcessGroup.destroy();
    }

    render() {

    }
}