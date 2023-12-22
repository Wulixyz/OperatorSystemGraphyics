class Display extends AnimationObjectBase {
    constructor(root) {
        super();
        this.root = root;
        this.ModuleFactory = this.root.ModuleFactory;
        this.$display = $(`<div class='schedule-display'></div>`);
        this.root.$schedule.append(this.$display);

        this.processInfoArray = this.root.menu.processInfoArray;

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
        this.displayBackground = new DisplayBackground(this);

        this.ctx = this.displayBackground.ctx;

        this.processWaitGroup = new ProcessWaitGroup(this);
        
        this.processHandleGroups = [];
        for(let i = 1;i <= 3;i ++ ) {
            this.processHandleGroups.push(new ProcessHandleGroup(this,[this.width / 4 * i,this.height * 0.75],"FCFS"));
        }
        
        this.resize();

        this.$display.show();
    }

    hide() {
        this.$display.hide();
    }
}
