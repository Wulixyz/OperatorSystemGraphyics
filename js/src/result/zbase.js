class Result {
    constructor(root) {
        this.root = root;
        this.$result = $(`<div class="result"></div>`);
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
