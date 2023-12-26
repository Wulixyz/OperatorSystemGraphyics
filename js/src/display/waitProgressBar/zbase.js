class WaitProgressBar extends AnimationObjectBase {
    constructor(root,pos,width,height) {
        super();
        this.root = root;
        this.processRunnerControl = this.root.processRunnerControl;
        this.ctx = this.root.ctx;
        this.scale = this.root.scale;
        this.pos = pos;
        this.width = width;
        this.height = this.scale * 0.01;
        this.currentTime = 0;
        this.lastWaittingTime = 0;
        this.currentWaittingTime = 0;
        this.hasRun = false;
    }

    start() {

    }

    render() {
        this.renderBarBase();
        this.renderProgress();
    }

    renderBarBase() {
        this.ctx.fillStyle = "rgba(0,0,0,0.3)";
        this.ctx.fillRect(this.pos[0],this.pos[1] - this.height / 2,this.width,this.height);
    }
    
    renderProgress() {
        this.ctx.fillStyle = "rgba(148,71,80,1)";
        this.ctx.fillRect(this.pos[0],this.pos[1] - this.height / 2,this.width * ((this.currentTime - this.lastWaittingTime) / (this.currentWaittingTime - this.lastWaittingTime)),this.height);
    }

    update() {
        this.renderBarBase();
        if(this.currentWaittingTime >= 0) {
            this.renderProgress();
            this.updateCurrentTime();
            this.updateLastWaittingTIme();
        }
        this.updateCurrentWaittingTime();
    }

    updateCurrentTime() {
        this.currentTime = this.processRunnerControl.getCurrentTime(); 
    }

    updateCurrentWaittingTime() {
        const waitProcessInfoArray = this.processRunnerControl.getWaitProcessInfo();
        if(waitProcessInfoArray.length > 0) {
            this.currentWaittingTime = waitProcessInfoArray[0]['arrivalTime'];
            this.hasRun = true;
        } else {
            if(this.hasRun) this.currentWaittingTime = -1;
        }
    }

    updateLastWaittingTIme() {
        if(this.currentTime >= this.currentWaittingTime) {
            this.lastWaittingTime = this.currentWaittingTime;
        }
    }

    on_destroy() {

    }
}