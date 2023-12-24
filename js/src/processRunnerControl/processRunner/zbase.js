class ProcessRunner extends AnimationObjectBase {
    constructor(root,mode) {
        super();
        this.root = root;
        this.mode = mode;
        this.ModuleFactory = this.root.ModuleFactory;
        this.addProcessArray = this.root.addProcessArray;

        this.instancePromise = new this.ModuleFactory();

        
        this.waitProcessInfoArray = [];
        this.handleProcessInfoArray = [];
        this.completeProcessInfoArray = [];

        this.isReady = false;

        this.isCompleted = false;
    }

    start() {
        this.instancePromise.then((module) => {
            this.instance = module;
            this.startInstance();
        });
    }

    startInstance() {
        const processes = this.addProcessArray;
        for(let i = 0;i < processes.length;i ++ ) {
            this.instance.addWaitProcess(processes[i]['processName'],processes[i]['arrivalTime'],processes[i]['priority'],processes[i]['burstTime']);
        }

        this.instance.selectMode(this.mode);

        this.isReady = true;
    } 

    update() {
        if(this.isReady) {
            this.instance.runProcess(this.timedelta / 1000);

            this.updateProcessInfo();
            this.updateCompleted();
        }
    }

    updateProcessInfo() {
        this.waitProcessInfoArray = this.getWaitProcessInfo();
        this.handleProcessInfoArray = this.getHandleProcessInfo();
        this.completeProcessInfoArray = this.getCompleteProcessInfo();
    }

    updateCompleted() {
        if(this.waitProcessInfoArray < 1 && this.handleProcessInfoArray.length < 1) this.isCompleted = true;
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
                'completeTime': processInfo[i].completeTime,
            });
        }
        return processInfoArray;
    }
}