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

        this.processBlockArray = [];
    }

    start() {
        this.groupGraphyics = new LineProcessGroup(this,this.pos,this.width,this.height,"Waitting");

        let PBpos = this.pos;
        for(let i = 0;i < this.PBShowCount;i ++ ) {
            this.processBlockArray.push(new ProcessBlock(this,PBpos,this.PBWidth,this.PBheight));
            PBpos = [PBpos[0] + this.PBWidth + 0.02 * this.scale,PBpos[1]];
        }

        this.overflowProcessGroup = new OverflowProcessGroup(this.display,PBpos,this.PBWidth,this.PBheight,'line');
    }

    render() {
        
    }

    update() {
        this.updateProcessInfo();
        this.updateProcessBlockInfo();
        this.updateOverflowProcessGroupShow();
        this.render();
    }

    updateProcessInfo() {
        this.processInfoArray = this.processRunnerControl.getWaitProcessInfo();
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
 }