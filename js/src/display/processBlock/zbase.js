class ProcessBlock extends AnimationObjectBase {
    constructor(root,pos1,pos2) {
        super();
        this.root = root;
        this.ctx = this.root.ctx;
        this.pos1 = pos1;
        this.pos2 = pos2;
    }

    update() {
        this.render();
    }

    render() {
        this.ctx.fillStyle = "rgba(242,232,60,1)";
        this.fillRect(this.pos1[0],this.pos1[1],this.pos2[0],this.pos2[1]);
    }
}