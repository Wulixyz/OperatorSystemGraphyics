class Display extends AnimationObjectBase {
    constructor(root) {
        super();
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

    }

    resize() {
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
}
