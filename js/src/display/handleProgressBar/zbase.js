class HandleProgressBar extends AnimationObjectBase {
    constructor(root,pos,width,height,mode) {
        super();
        this.root = root;
        this.processRunnerControl = this.root.processRunnerControl;
        this.ctx = this.root.ctx;
        this.scale = this.root.scale;
        this.pos = pos;
        this.width = this.scale * 0.01;
        this.height = height;
        this.mode = mode;

        this.currentTime = 0;
        this.handleTime = 0;
        this.burstTime = 0;
        this.hasRun = false;
    }

    renderBarBase() {
        this.ctx.fillStyle = "rgba(0,0,0,0.3)";
        this.ctx.fillRect(this.pos[0] - this.width / 2,this.pos[1] - this.height,this.width,this.height);
    }

    renderProcess() {
        this.ctx.save();
        this.ctx.translate(this.pos[0] + this.width / 2,this.pos[1]);
        this.ctx.rotate(Math.PI);
        this.ctx.fillStyle = "rgba(148,71,80,1)";
        this.ctx.fillRect(0,0,this.width,this.height * (this.handleTime / this.burstTime));
        this.ctx.restore();
    }

    update() {
        this.renderBarBase();
        if(this.burstTime >= 0) {
            this.renderProcess();
            this.updateHandleTime();
        }
        this.updateburstTime();
    }

    updateHandleTime() {
        this.handleTime = this.processRunnerControl.getHandleTime(this.mode);
    }

    updateburstTime() {
        const handleProcessInfoArray = this.processRunnerControl.getHandleProcessInfo(this.mode);
        if(handleProcessInfoArray.length > 0) {
            this.burstTime = handleProcessInfoArray[0]['burstTime'];
            this.hasRun = true;
        } else {
            if(this.hasRun) this.burstTime = -1;
        }
    }
}