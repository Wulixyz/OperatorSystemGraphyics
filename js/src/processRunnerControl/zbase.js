class ProcessRunnerControl {
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
}