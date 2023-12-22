class ProcessBlock extends AnimationObjectBase {
    constructor(root,pos,width,height) {
        super();
        this.root = root;
        this.ctx = this.root.ctx;
        this.width = width;
        this.height = height;
        this.scale = this.root.scale;
        this.pos = pos;

        this.pos1 = [this.pos[0],this.pos[1] - this.height / 2];
    }

    update() {
        this.render();
    }

    render() {
        this.renderBlock();
        this.renderProcessName();
    }

    renderBlock() {
        this.ctx.fillStyle = "rgba(242,232,60,1)";
        this.ctx.fillRect(this.pos1[0],this.pos1[1],this.width,this.height);
    }

    renderProcessName() {

    }
}