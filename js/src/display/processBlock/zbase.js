class ProcessBlock extends AnimationObjectBase {
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
}