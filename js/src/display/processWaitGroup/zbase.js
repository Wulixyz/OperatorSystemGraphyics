class ProcessWaitGroup extends AnimationObjectBase {
    constructor(display) {
        super();
        this.display = display;
        this.processRunnerControl = this.display.processRunnerControl;

        this.ctx = this.display.ctx;
        this.scale = this.display.scale;
        this.width = 0.7 * this.scale;
        this.height = 0.14 * this.scale;
        this.pos = [0.3 * this.display.width,0.1 * this.display.height];

        this.PBWidth = this.width / 6;
        this.PBheight = this.height;
        this.PBShowCount = 5;
        this.processInfoArray = this.processRunnerControl.getWaitProcessInfo();
        this.lastWaittingProcess = null;

        this.processBlockArray = [];

        this.selectMode = this.display.selectMode;
    }

    start() {
        this.groupGraphyics = new LineProcessGroup(this,this.pos,this.width,this.height,"Waitting");

        let PBpos = this.pos;
        for(let i = 0;i < this.PBShowCount;i ++ ) {
            this.processBlockArray.push(new ProcessBlock(this,PBpos,this.PBWidth,this.PBheight));
            PBpos = [PBpos[0] + this.PBWidth,PBpos[1]];
        }

        this.overflowProcessGroup = new OverflowProcessGroup(this.display,PBpos,this.PBWidth,this.PBheight,'line');

        this.waitProgressBar = new WaitProgressBar(this,[this.pos[0],this.pos[1] + this.scale * 0.1],this.width,this.height);
    }

    render() {
        
    }

    update() {
        this.updateProcessInfo();
        this.updateProcessBlockInfo();
        this.updateOverflowProcessGroupShow();
        this.updateProcessOut();
        this.render();
    }

    updateProcessInfo() {
        this.processInfoArray = this.processRunnerControl.getWaitProcessInfo();
    }

    updateProcessOut() {
        if(this.lastWaittingProcess == null) {
            this.lastWaittingProcess = this.processInfoArray[0];
        } else if(this.processInfoArray[0] == null || this.lastWaittingProcess['processName'] != this.processInfoArray[0]['processName']) {
            if(this.lastWaittingProcess != null) {
                for(let i = 0;i < this.selectMode.length;i ++ ) {
                    new MoveProcessBlock(this,this.pos,[this.display.width / (this.selectMode.length + 1) * (i + 1),this.display.height * 0.25],this.PBWidth,this.PBheight,this.lastWaittingProcess);
                }
            }
            this.lastWaittingProcess = this.processInfoArray[0];
        }
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

    on_destroy() {
        this.groupGraphyics.destroy();
        for(let i = 0;i < this.processBlockArray.length;i ++ ) {
            this.processBlockArray[i].destroy();
        }
        this.overflowProcessGroup.destroy();
        this.waitProgressBar.destroy();
    }
 }