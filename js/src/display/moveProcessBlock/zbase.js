class MoveProcessBlock extends AnimationObjectBase {
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
        const processNamePos = [pos[0] - this.width / 5 * 1,pos[1]];
        pos[0] = pos[0] - this.width / 2,pos[1] = pos[1] - this.heigth / 2;
        
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
}