class ProcessStopper extends AnimationObjectBase {
    constructor(root) {
        super();
        this.root = root;
        this.processRunners = this.root.processRunners;

        this.isAllCompleted = false;
        this.completeTime = 0;
        this.showResultTime = 3;
    }

    start() {

    }

    update() {
        if(Object.keys(this.processRunners).length > 0) {
            this.updateIsAllComplete();
            this.updateCompleteTime();
        }
    }

    updateIsAllComplete() {
        let isAllCompleted = true;
        for(let key in this.processRunners) {
            if(this.processRunners.hasOwnProperty(key)) {
                isAllCompleted = isAllCompleted && this.processRunners[key].isCompleted;
            }
        }

        this.isAllCompleted = isAllCompleted;
    }

    updateCompleteTime() {
        if(this.isAllCompleted === true) {
            this.completeTime += this.timedelta / 1000;
        }

        if(this.completeTime >= this.showResultTime) {
            console.log("All Complete");
            this.root.root.display.destroy();
            this.root.root.display.hide();
            this.root.root.result.start();
            this.destroy();
        }
    }

    on_destroy() {
        for(let key in this.processRunners) {
            this.processRunners[key].destroy();
        }
    }
}