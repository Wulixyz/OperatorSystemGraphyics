export class Schedule {
    constructor(id) {
        this.id = id;
        this.$schedule = $('#' + id);

        this.menu = new Menu(this);
        this.display = new Display(this);
        this.result = new Result(this);

        this.start();
    }

    start() {
        
    }
}
