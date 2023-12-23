class ProcessCompleteGroup extends AnimationObjectBase {
    constructor(display,pos,width,height) {
        super();
        this.display = display;
        this.ctx = this.display.ctx;
        this.pos = pos;
        this.width = width;
        this.height = height;
        this.scale = this.display.scale;

        this.PBwidth = this.width / 4;
        this.PBheight = this.height;
        this.PBShowCount = 3;
        this.processInfoArray = this.display.processInfoArray;
        this.processBlockArray = [];
        
        this.start();
    }

    start() {
        this.groupGraphyics = new LineProcessGroup(this,this.pos,this.width,this.height,"Completed");

        let PBpos = this.pos;
        for(let i = 0;i < this.PBShowCount;i ++ ) {
            this.processBlockArray.push(new ProcessBlock(this,PBpos,this.PBwidth,this.PBheight));
            PBpos = [PBpos[0] + this.PBwidth + 0.01 * this.scale,PBpos[1]];
        }

        this.overflowProcessGroup = new OverflowProcessGroup(this.display,PBpos,this.PBWidth,this.PBheight,'line');
    }

    update() {
        this.updateProcessBlockInfo();
        this.updateOverflowProcessGroupShow();
        this.render();
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

    }
}