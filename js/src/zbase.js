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
