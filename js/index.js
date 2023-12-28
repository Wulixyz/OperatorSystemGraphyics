let ANIMATION_OBJECT = [];

class AnimationObjectBase {
  constructor() {
    ANIMATION_OBJECT.push(this);
    this.is_started = false;
    this.timedelta = 0;

    this.uuid = this.creat_uuid();
  }

  creat_uuid() {
    let res = "";
    for (let i = 0; i < 8; i++) {
      let x = parseInt(Math.floor(Math.random() * 10)); // 创建一个0 ~ 9的数字
      res += x;
    }
    return res;
  }

  start() {
    // 开始时执行一次
  }

  update() {
    // 每帧执行一次
  }

  late_update() { 
    // 每一帧最后执行一次
  }

  on_destroy() {
    // 销毁前执行一次
  }

  destroy() {
    // 销毁
    this.on_destroy()

    for(let i = 0;i < ANIMATION_OBJECT.length;i ++ ) {
      if(ANIMATION_OBJECT[i] === this) {
        ANIMATION_OBJECT.splice(i,1);
        break;
      }
    }
  }
}

let last_timestamp;
let ANIMATION = function(timestamp) {
  for(let i = 0;i < ANIMATION_OBJECT.length;i ++ ) {
    if(!ANIMATION_OBJECT[i].is_started) {
      ANIMATION_OBJECT[i].is_started = true;
      ANIMATION_OBJECT[i].start();
    } else {
      ANIMATION_OBJECT[i].timedelta = timestamp - last_timestamp;
      ANIMATION_OBJECT[i].update();
    }
  }

  for(let i = 0;i < ANIMATION_OBJECT.length;i ++ ) {
    ANIMATION_OBJECT[i].late_update();
  }
  
  last_timestamp = timestamp;

  requestAnimationFrame(ANIMATION);
}

requestAnimationFrame(ANIMATION);
class DisplayBackground extends AnimationObjectBase {
    constructor(display) {
        super();
        this.display = display;
        this.$canvas = $(`<canvas tabindex=0></canvas>`);

        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.display.width;
        this.ctx.canvas.height = this.display.height;
        this.display.$display.append(this.$canvas);
    }

    start() {
        this.$canvas.focus();
    }

    resize() {
        this.ctx.canvas.height = this.display.height;
        this.ctx.canvas.width = this.display.width;
        this.ctx.fillStyle = "rgba(138,210,223,1)";
        this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
    }

    update() {
        this.render();
    }

    render() {
        this.ctx.fillStyle = "rgba(138,210,223,1)";
        this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
    }
}class HandleProgressBar extends AnimationObjectBase {
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
}class LineProcessGroup extends AnimationObjectBase {
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

        this.arcRadius = 20;
    }

    update() {
        this.render();
    }

    render() {
        this.renderLine();
        this.renderMode();
    }

    renderLine() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.topLeft[0] + this.arcRadius, this.topLeft[1]);
        this.ctx.lineTo(this.topRight[0], this.topRight[1]);
        this.ctx.moveTo(this.bottomRight[0],this.bottomRight[1]);
        this.ctx.lineTo(this.bottomLeft[0] + this.arcRadius, this.bottomLeft[1]);
        this.ctx.arcTo(this.bottomLeft[0], this.bottomLeft[1], this.bottomLeft[0], this.bottomLeft[1] - this.arcRadius, this.arcRadius);
        this.ctx.lineTo(this.topLeft[0], this.topLeft[1] + this.arcRadius);
        this.ctx.arcTo(this.topLeft[0], this.topLeft[1], this.topLeft[0] + this.arcRadius, this.topLeft[1], this.arcRadius);
        this.ctx.stroke();
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
}class MoveProcessBlock extends AnimationObjectBase {
    constructor(root,pos1,pos2,width,heigth,processInfo) {
        super();
        this.root = root;
        this.ctx = this.root.ctx;
        this.scale = this.root.scale;
        this.pos1 = pos1;
        this.pos2 = pos2;
        this.width = width;
        this.heigth = heigth;
        this.processInfo = processInfo;
        this.cornerRadius = 20;

        this.hasRunTime = 0;  // 单位ms
        this.animationTime = 400;  // 单位ms

        this.xdist = this.pos2[0] - this.pos1[0];
        this.ydist = this.pos2[1] - this.pos1[1];
        this.dist = Math.sqrt(Math.pow(this.xdist,2) + Math.pow(this.ydist,2));

        this.angle = Math.atan2(this.ydist,this.xdist);

        this.speed = this.dist / this.animationTime;
    }

    start() {

    }

    update() {
        const runDist = this.speed * this.hasRunTime;
        const pos = [this.pos1[0] + runDist * Math.cos(this.angle),this.pos1[1] + runDist * Math.sin(this.angle)];
        const processNamePos = [pos[0] + this.width / 5 * 2,pos[1]];
        pos[1] = pos[1] - this.heigth / 2;
        
        this.renderBlock(pos);
        this.renderProcessName(processNamePos);

        if(this.hasRunTime >= this.animationTime) this.destroy();
        this.hasRunTime += this.timedelta;
    }

    renderBlock(pos) {
        this.ctx.beginPath();
        this.ctx.moveTo(pos[0],pos[1]);
        this.ctx.lineTo(pos[0] + this.width - this.cornerRadius,pos[1]);
        this.ctx.arcTo(pos[0] + this.width,pos[1],pos[0] + this.width,pos[1] + this.cornerRadius,this.cornerRadius);
        this.ctx.lineTo(pos[0] + this.width,pos[1] + this.heigth - this.cornerRadius);
        this.ctx.arcTo(pos[0] + this.width,pos[1] + this.heigth,pos[0] + this.width - this.cornerRadius,pos[1] + this.heigth,this.cornerRadius);
        this.ctx.lineTo(pos[0] + this.cornerRadius,pos[1] + this.heigth);
        this.ctx.arcTo(pos[0],pos[1] + this.heigth,pos[0],pos[1] + this.heigth - this.cornerRadius,this.cornerRadius);
        this.ctx.lineTo(pos[0],pos[1] + this.cornerRadius);
        this.ctx.arcTo(pos[0],pos[1],pos[0] + this.cornerRadius,pos[1],this.cornerRadius);
        this.ctx.fillStyle = this.processInfo['blockColor'];
        this.ctx.fill();
    }

    renderProcessName(pos) {
        this.ctx.font = "20px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.fillText(this.processInfo['processName'],pos[0],pos[1]);
    }

    on_destroy() {

    }
}class OverflowProcessGroup extends AnimationObjectBase {
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
}class ProcessBlock extends AnimationObjectBase {
    constructor(root,pos,width,height) {
        super();
        this.root = root;
        this.ctx = this.root.ctx;
        this.width = width;
        this.height = height;
        this.scale = this.root.scale;
        this.pos = pos;
        this.cornerRadius = 20;

        this.pos1 = [this.pos[0],this.pos[1] - this.height / 2];
        this.processNamePos = [this.pos[0] + this.width / 5 * 2,this.pos[1]];

        this.processInfo = null;
    }

    changeProcessInfo(processInfo) {
        this.processInfo = processInfo;
    }

    update() {
        if(this.processInfo != null) {
            this.render();
        }
    }

    render() {
        this.renderBlock();
        this.renderProcessName();
    }

    renderBlock() {
        this.ctx.beginPath();
        
        // 左上角
        this.ctx.moveTo(this.pos1[0] + this.cornerRadius, this.pos1[1]);
        // 右上角
        this.ctx.lineTo(this.pos1[0] + this.width - this.cornerRadius, this.pos1[1]);
        this.ctx.arcTo(this.pos1[0] + this.width, this.pos1[1], this.pos1[0] + this.width, this.pos1[1] + this.cornerRadius, this.cornerRadius);

        // 右下角
        this.ctx.lineTo(this.pos1[0] + this.width, this.pos1[1] + this.height - this.cornerRadius);
        this.ctx.arcTo(this.pos1[0] + this.width, this.pos1[1] + this.height, this.pos1[0] + this.width - this.cornerRadius, this.pos1[1] + this.height, this.cornerRadius);

        // 左下角
        this.ctx.lineTo(this.pos1[0] + this.cornerRadius, this.pos1[1] + this.height);
        this.ctx.arcTo(this.pos1[0], this.pos1[1] + this.height, this.pos1[0], this.pos1[1] + this.height - this.cornerRadius, this.cornerRadius);

        // 左上角
        this.ctx.lineTo(this.pos1[0], this.pos1[1] + this.cornerRadius);
        this.ctx.arcTo(this.pos1[0], this.pos1[1], this.pos1[0] + this.cornerRadius, this.pos1[1], this.cornerRadius);

        // 填充矩形
        this.ctx.fillStyle = this.processInfo['blockColor'];
        this.ctx.fill();
    }

    renderProcessName() {
        this.ctx.font = "20px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.fillText(this.processInfo['processName'],this.processNamePos[0],this.processNamePos[1]);
    }
}class ProcessCompleteGroup extends AnimationObjectBase {
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
}class ProcessHandleGroup extends AnimationObjectBase {
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
        this.lastHandleProcess = null;

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
}class ProcessWaitGroup extends AnimationObjectBase {
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
                    new MoveProcessBlock(this,this.pos,[this.display.width / (this.selectMode.length + 1) * (i + 1) - this.PBWidth / 2,this.display.height * 0.25],this.PBWidth,this.PBheight,this.lastWaittingProcess);
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
 }class WaitProgressBar extends AnimationObjectBase {
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
}class Display{
    constructor(root) {
        this.root = root;
        this.processRunnerControl = this.root.processRunnerControl;
        this.$display = $(`<div class='schedule-display'></div>`);
        this.root.$schedule.append(this.$display);

        this.width = this.$display.width();
        this.height = this.$display.height();
        this.scale = this.height;

        this.hide();
        this.start();
    }

    start() {
        $(window).on('resize',() => {
            this.resize();
        });
    }

    resize() {
        this.width = this.$display.width();
        this.height = this.$display.height();
        this.scale = this.height;
        if(this.displayBackground) this.displayBackground.resize();
    }

    show() {
        this.processInfoArray = this.root.menu.addProcessArray;
        this.selectMode = this.root.menu.selectMode;

        this.displayBackground = new DisplayBackground(this);

        this.ctx = this.displayBackground.ctx;

        this.processWaitGroup = new ProcessWaitGroup(this);
        
        this.processHandleGroups = [];
        for(let i = 0;i < this.selectMode.length;i ++ ) {
            this.processHandleGroups.push(new ProcessHandleGroup(this,[this.width / (this.selectMode.length + 1) * (i + 1),this.height * 0.75],this.selectMode[i]));
        }
        
        this.resize();

        this.$display.show();
    }

    hide() {
        this.$display.hide();
    }

    destroy() {
        this.displayBackground.destroy();
        this.processWaitGroup.destroy();
        for(let i = 0;i < this.processHandleGroups.length;i ++ ) {
            this.processHandleGroups[i].destroy();
        }
    }
}
class Menu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
            <div class='background'>
                <div class='menu'>
                    <div class='input-and-random'>
                        <div class="input-form col-md-4 mx-auto"></div>
                        <div class="select-by-input d-grid gap-2.5 col-6 mx-auto">
                            <button class="menu-button add-info-button btn btn-success" type="button">+add</button>
                            <button class="menu-button select-by-input-button btn btn-primary" type="button">自己输入</button>
                        </div>
                        <div class="select-by-random d-grid gap-2.5 col-6 mx-auto">
                            <button class="menu-button select-by-random-button btn btn-primary" type="button">随机生成</button>
                        </div>
                    </div>
                    <div class='mode-select select-check'>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1">
                            <label class="form-check-label" for="inlineCheckbox1">FCFS</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" id="inlineCheckbox2" value="option2">
                            <label class="form-check-label" for="inlineCheckbox2">SJF</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" id="inlineCheckbox3" value="option3">
                            <label class="form-check-label" for="inlineCheckbox3">HPF</label>
                        </div>
                    </div>
                    <div class='submit-button-field'>
                        <div class="d-grid gap-2.5 col-6 mx-auto">
                            <button class="menu-button submit-button btn btn-primary" type="button">提交</button>
                        </div>
                    </div>
                </div>
            </div>
        `)

        // this.$menu.hide();
        this.$selectByInput = this.$menu.find('.select-by-input');
        this.$selectByRandom = this.$menu.find('.select-by-random');
        this.$selectByInputButton = this.$menu.find('.select-by-input-button');
        this.$selectByRandomButton = this.$menu.find('.select-by-random-button');
        this.$inputForm = this.$menu.find('.input-form');
        this.$addInfoButton = this.$selectByInput.find('.add-info-button');
        this.$selectMode = this.$menu.find('.mode-select');
        this.$submitButton = this.$menu.find('.submit-button');

        this.$inputForm.hide();
        this.$addInfoButton.hide();

        this.addNewInputGroup();

        this.root.$schedule.append(this.$menu);

        this.isRandom = true;
        this.seed = Math.floor(Math.random() * 10000);  // 生成随机种子
        this.generator = new Math.seedrandom(this.seed);  // 随机数生成器

        this.colors = ["#00A86B","#FF4500","#317873"," #8A2BE2","#00416A"];
        
        this.start();
    }

    start() {
        this.addListenEvents();
    }
    
    addListenEvents() {
        let outer = this;

        this.$selectByInputButton.click(() => {
            outer.$selectByInputButton.prop('disabled', true);
            outer.$selectByRandomButton.prop('disabled',false);
            outer.$inputForm.show();
            outer.$addInfoButton.show();
    
            outer.isRandom = false;
        });

        this.$selectByRandomButton.click(() => {
            outer.$selectByInputButton.prop('disabled', false);
            outer.$selectByRandomButton.prop('disabled',true);
            outer.$inputForm.hide();
            outer.$addInfoButton.hide();

            outer.isRandom = true;
        });

        this.$addInfoButton.click(() => {
            outer.addNewInputGroup();
        });

        this.$inputForm.on('click', '.input-group-delete-button', function() {
            // 在这里处理删除操作
            $(this).closest('.input-group').remove();
        });

        this.$submitButton.click(() => {
            let processInfoArray = [];

            if(outer.isRandom === false) {
                outer.$inputForm.find('.input-group').each(function() {
                    const inputValues = $(this).find('input').map(function() {
                        return $(this).val();
                    }).get();
                    processInfoArray.push({
                        'processName': inputValues[0],
                        'arrivalTime': parseFloat(inputValues[1]),
                        'priority': parseFloat(inputValues[2]),
                        'burstTime': parseFloat(inputValues[3]),
                    });
                });
            } else {
                const processCount = this.generateRandomInt(5, 10);
                let dividedId = 1;

                for (var i = 1; i <= processCount; i++) {
                    processInfoArray.push({
                        'processName': "P" + dividedId,
                        'arrivalTime': this.generateRandomDouble(2,5),
                        'priority': this.generateRandomDouble(1,20),
                        'burstTime': this.generateRandomDouble(2,5),
                    });
                    dividedId ++;
                }
            }

            for(let i = 0;i < processInfoArray.length;i ++ ) {
                processInfoArray[i]['blockColor'] = this.colors[this.generateRandomInt(0,this.colors.length - 1)];
            }

            outer.getSelectMode();
            outer.addProcessArray = processInfoArray;

            if(outer.selectMode.length < 1) {
                alert("请至少选择一种模式");
            } else {
                console.log(outer.addProcessArray);
                outer.hide();
                outer.root.processRunnerControl.start();
                outer.root.display.show();
            }
        });
    }

    show() {
        this.$menu.show();
    }

    hide() {
        this.$menu.hide();
    }

    generateRandomDouble(l,r) {  // 生成范围在 l 到 r 之间的均匀分布的浮点数
        return this.generator() * (r - l) + l;
    }

    generateRandomInt(l,r) {  // 生成范围在 l 到 r 之间的均匀分布的整数
        return Math.floor(this.generator() * (r - l + 1)) + l;
    }

    getSelectMode() {
        let modes = ['FCFS','SJF','HPF'];
        let modeIsSelect = this.$selectMode.find('.form-check-input').map(function() {
            return $(this).is(':checked');
        }).get();

        this.selectMode = [];
        for(let i = 0;i < modeIsSelect.length;i ++ ) {
            if(modeIsSelect[i]) this.selectMode.push(modes[i]);
        }
    }

    addNewInputGroup() {
        const newInputGroup = $(`
            <div class="input-group">
                <span class="input-group-text" id="inputGroup-sizing-default">Process Info</span>
                <input type="text" placeholder="ProcessName" class="form-control">
                <input type="text" placeholder="ArrivalTime" class="form-control">
                <input type="text" placeholder="Priority" class="form-control">
                <input type="text" placeholder="BurstTime" class="form-control">
                <button type="button" class="input-group-delete-button btn btn-danger">delete</button>
            </div>
        `);
        this.$inputForm.append(newInputGroup);
    }
}
class ProcessRunner extends AnimationObjectBase {
    constructor(root,mode) {
        super();
        this.root = root;
        this.mode = mode;
        this.ModuleFactory = this.root.ModuleFactory;
        this.addProcessArray = this.root.addProcessArray;

        this.instancePromise = new this.ModuleFactory();
        
        this.waitProcessInfoArray = [];
        this.handleProcessInfoArray = [];
        this.completeProcessInfoArray = [];

        this.isReady = false;

        this.isCompleted = false;

        this.currentTime = 0;
        this.handleTime = 0;
    }

    start() {
        this.instancePromise.then((module) => {
            this.instance = module;
            this.startInstance();
        });
    }

    startInstance() {
        const processes = this.addProcessArray;
        for(let i = 0;i < processes.length;i ++ ) {
            this.instance.addWaitProcess(processes[i]['processName'],processes[i]['arrivalTime'],processes[i]['priority'],processes[i]['burstTime'],processes[i]['blockColor']);
        }

        this.instance.selectMode(this.mode);

        this.isReady = true;
    } 

    update() {
        if(this.isReady) {
            this.instance.runProcess(this.timedelta / 1000);

            this.updateProcessInfo();
            this.updateCompleted();
            this.updateCurrentTime();
            this.updateHandleTime();
        }
    }

    updateProcessInfo() {
        this.waitProcessInfoArray = this.getWaitProcessInfo();
        this.handleProcessInfoArray = this.getHandleProcessInfo();
        this.completeProcessInfoArray = this.getCompleteProcessInfo();
    }

    updateCompleted() {
        if(this.waitProcessInfoArray < 1 && this.handleProcessInfoArray.length < 1) this.isCompleted = true;
    }

    updateCurrentTime() {
        this.currentTime = this.instance.getCurrentTime();
    }

    updateHandleTime() {
        this.handleTime = this.instance.getHandleTime();
    }

    getWaitProcessInfo() {
        let processInfoArray = [];
        const processInfo = this.instance.getWaitProcess();
        for(let i = 0;i < processInfo.length;i ++ ) {
            processInfoArray.push({
                'processName': processInfo[i].name,
                'arrivalTime': processInfo[i].arrivalTime,
                'priority': processInfo[i].priority,
                'burstTime': processInfo[i].burstTime,
                'blockColor': processInfo[i].blockColor,
            });
        }
        return processInfoArray;
    }

    getHandleProcessInfo() {
        let processInfoArray = [];
        const processInfo = this.instance.getHandleProcess();
        for(let i = 0;i < processInfo.length;i ++ ) {
            processInfoArray.push({
                'processName': processInfo[i].name,
                'arrivalTime': processInfo[i].arrivalTime,
                'priority': processInfo[i].priority,
                'burstTime': processInfo[i].burstTime,
                'blockColor': processInfo[i].blockColor,
            });
        }
        return processInfoArray;
    }

    getCompleteProcessInfo() {
        let processInfoArray = [];
        const processInfo = this.instance.getCompleteProcess();
        for(let i = 0;i < processInfo.length;i ++ ) {
            processInfoArray.push({
                'processName': processInfo[i].name,
                'arrivalTime': processInfo[i].arrivalTime,
                'priority': processInfo[i].priority,
                'burstTime': processInfo[i].burstTime,
                'completeTime': processInfo[i].completeTime,
                'blockColor': processInfo[i].blockColor,
            });
        }
        return processInfoArray;
    }
}class ProcessStopper extends AnimationObjectBase {
    constructor(root) {
        super();
        this.root = root;
        this.processRunners = this.root.processRunners;

        this.isAllCompleted = false;
        this.completeTime = 0;
        this.showResultTime = 3;
    }

    start() {

    }

    update() {
        if(Object.keys(this.processRunners).length > 0) {
            this.updateIsAllComplete();
            this.updateCompleteTime();
        }
    }

    updateIsAllComplete() {
        let isAllCompleted = true;
        for(let key in this.processRunners) {
            if(this.processRunners.hasOwnProperty(key)) {
                isAllCompleted = isAllCompleted && this.processRunners[key].isCompleted;
            }
        }

        this.isAllCompleted = isAllCompleted;
    }

    updateCompleteTime() {
        if(this.isAllCompleted === true) {
            this.completeTime += this.timedelta / 1000;
        }

        if(this.completeTime >= this.showResultTime) {
            console.log("All Complete");
            this.root.root.display.destroy();
            this.root.root.display.hide();
            this.root.root.result.start();
            this.destroy();
        }
    }

    on_destroy() {
        for(let key in this.processRunners) {
            this.processRunners[key].destroy();
        }
    }
}class ProcessRunnerControl {
    constructor(root) {
        this.root = root;
        this.ModuleFactory = this.root.ModuleFactory;

        this.processRunners = {};   
    }

    start() {
        this.addProcessArray = this.root.menu.addProcessArray;
        this.selectMode = this.root.menu.selectMode;

        for(let i = 0;i < this.selectMode.length;i ++ ) {
            this.processRunners[this.selectMode[i]] = new ProcessRunner(this,this.selectMode[i]);
        }

        this.processStopper = new ProcessStopper(this);
    }

    getCurrentTime() {
        return this.processRunners[this.selectMode[0]].currentTime;
    }

    getHandleTime(mode) {
        return this.processRunners[mode].handleTime;
    }

    getWaitProcessInfo() {
        return this.processRunners[this.selectMode[0]].waitProcessInfoArray;
    }

    getHandleProcessInfo(mode) {
        return this.processRunners[mode].handleProcessInfoArray;
    }

    getCompleteProcessInfo(mode) {
        return this.processRunners[mode].completeProcessInfoArray;
    }
}class CompleteProcessResult {
    constructor(root,mode,processInfoArray) {
        this.root = root;
        this.mode = mode;
        this.processInfoArray = processInfoArray;

        this.$completeProcessResult = $(`
            <div class="complete-result d-grid gap-2.5 col-6 mx-auto">
                <div class="complete-result-card card">
                    <div class="complete-result-title card-header">${this.mode}运行结果</div>
                    <ul class="complete-result-body list-group list-group-flush"></ul>
                </div>
            </div>
            
        `);

        this.$completeResultBody = this.$completeProcessResult.find('.complete-result-body');
        this.$completeResultCard = this.$completeProcessResult.find('.complete-result-card');

        this.root.$result.append(this.$completeProcessResult);

        this.start();
    }

    start() {
        for(let i = 0;i < this.processInfoArray.length;i ++) {
            let p = this.processInfoArray[i];
            this.$completeResultBody.append($(`
                <li class="complete-result-info list-group-item">
                    进程 ${p.processName} 于 ${p.completeTime.toFixed(3)} 完成。周转时间为 ${(p.completeTime - p.arrivalTime).toFixed(3)}。带权周转时间为 ${((p.completeTime - p.arrivalTime) / p.burstTime).toFixed(3)}
                </li>
            `));
        } 

        let totalTurnaroundTime = 0,totalTurnaroundTimeWithWeight = 0;
        for(let p of this.processInfoArray) {
            totalTurnaroundTime += p.completeTime - p.arrivalTime;
            totalTurnaroundTimeWithWeight += (p.completeTime - p.arrivalTime) / p.burstTime;
        }

        this.$completeResultCard.append($(`
            <div class="card-footer">
                平均周转时间为 ${(totalTurnaroundTime / this.processInfoArray.length).toFixed(3)},平均带权周转时间为 ${(totalTurnaroundTimeWithWeight / this.processInfoArray.length).toFixed(3)}
            </div>
        `));
    }

    show() {

    }

    hide() {

    }
}class Result {
    constructor(root) {
        this.root = root;
        this.$result = $(`<div class="result result-background"></div>`);
        this.root.$schedule.append(this.$result);

        this.menu = this.root.menu;
        this.processRunnerControl = this.root.processRunnerControl;

        this.completeProcess = {};
        this.processInfoArray = [];

        this.hide();
    }

    start() {
        this.selectMode = this.menu.selectMode;
        for(let i = 0;i < this.selectMode.length;i ++ ) {
            this.processInfoArray.push(new CompleteProcessResult(this,this.selectMode[i],this.processRunnerControl.getCompleteProcessInfo(this.selectMode[i])));
        }
        this.show();
    }

    show() {
        this.$result.show();
    }

    hide() {
        this.$result.hide();
    }
}
export class Schedule {
    constructor(id,ModuleFactory) {
        this.id = id;
        this.ModuleFactory = ModuleFactory;
        this.$schedule = $('#' + id);

        this.menu = new Menu(this);
        this.processRunnerControl = new ProcessRunnerControl(this);
        this.display = new Display(this);
        this.result = new Result(this);

        this.start();
    }

    start() {
        
    }
}
