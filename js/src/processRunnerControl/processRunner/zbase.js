class ProcessRunner extends AnimationObjectBase {
    constructor(root,mode) {
        super();
        this.root = root;
        this.mode = mode;
        this.ModuleFactory = this.root.ModuleFactory;
        this.addProcessArray = this.root.addProcessArray;

        this.instance = new this.ModuleFactory();

        this.isReady = false;

        this.start();
    }

    start() {
        this.instance.then((module) => {
            this.startInstance();

            this.waitProcessInfoArray = this.getWaitProcessInfo();
            this.handleProcessInfoArray = this.getHandleProcessInfo();
            this.completeProcessInfoArray = this.getCompleteProcessInfo();

            this.isReady = true;
        });
    }

    startInstance() {
        this.instance.selectMode(this.mode);
        
        const processes = this.addProcessArray;
        for(let i = 0;i < processes.length;i ++ ) {
            this.instance.addWaitProcess(processes[i]['processName'],processes[i]['arrivalTime'],processes[i]['priority'],processes[i]['burstTime']);
        }
    } 

    update() {
        if(this.isReady) {
            this.instance.runProcess(this.timedelta);

            this.updateProcessInfo();
        }
    }

    updateProcessInfo() {
        this.waitProcessInfoArray = this.getWaitProcessInfo();
        this.handleProcessInfoArray = this.getHandleProcessInfo();
        this.completeProcessInfoArray = this.getCompleteProcessInfo();
    }

    getWaitProcessInfo() {
        let processInfoArray = [];
        const processInfo = this.instance.getWaitProcess();
        for(let i = 0;i < processInfo.length;i ++ ) {
            processInfoArray.push({
                'processName': processInfo[i].name,
                'arrivalTime': processInfo[i].arrivalTime,
                'priority': processInfo[i].priority,
                'burstTime': processInfo[i].burstTime,
            });
        }
        return processInfoArray;
    }

    getHandleProcessInfo() {
        let processInfoArray = [];
        const processInfo = this.instance.getHandleProcess();
        for(let i = 0;i < processInfo.length;i ++ ) {
            processInfoArray.push({
                'processName': processInfo[i].name,
                'arrivalTime': processInfo[i].arrivalTime,
                'priority': processInfo[i].priority,
                'burstTime': processInfo[i].burstTime,
            });
        }
        return processInfoArray;
    }

    getCompleteProcessInfo() {
        let processInfoArray = [];
        const processInfo = this.instance.getCompleteProcess();
        for(let i = 0;i < processInfo.length;i ++ ) {
            processInfoArray.push({
                'processName': processInfo[i].name,
                'arrivalTime': processInfo[i].arrivalTime,
                'priority': processInfo[i].priority,
                'burstTime': processInfo[i].burstTime,
            });
        }
        return processInfoArray;
    }
}