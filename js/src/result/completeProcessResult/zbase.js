class CompleteProcessResult {
    constructor(root,mode,processInfoArray) {
        this.root = root;
        this.mode = mode;
        this.processInfoArray = processInfoArray;

        this.$completeProcessResult = $(`
            <div class="complete-result d-grid gap-2.5 col-6 mx-auto">
                <div class="complete-result-card card">
                    <div class="complete-result-title card-header">${this.mode}运行结果</div>
                    <ul class="complete-result-body list-group list-group-flush"></ul>
                </div>
            </div>
            
        `);

        this.$completeResultBody = this.$completeProcessResult.find('.complete-result-body');
        this.$completeResultCard = this.$completeProcessResult.find('.complete-result-card');

        this.root.$result.append(this.$completeProcessResult);

        this.start();
    }

    start() {
        for(let i = 0;i < this.processInfoArray.length;i ++) {
            let p = this.processInfoArray[i];
            this.$completeResultBody.append($(`
                <li class="complete-result-info list-group-item">
                    进程 ${p.processName} 于 ${p.completeTime.toFixed(3)} 完成。周转时间为 ${(p.completeTime - p.arrivalTime).toFixed(3)}。带权周转时间为 ${((p.completeTime - p.arrivalTime) / p.burstTime).toFixed(3)}
                </li>
            `));
        } 

        let totalTurnaroundTime = 0,totalTurnaroundTimeWithWeight = 0;
        for(let p of this.processInfoArray) {
            totalTurnaroundTime += p.completeTime - p.arrivalTime;
            totalTurnaroundTimeWithWeight += (p.completeTime - p.arrivalTime) / p.burstTime;
        }

        this.$completeResultCard.append($(`
            <div class="card-footer">
                平均周转时间为 ${(totalTurnaroundTime / this.processInfoArray.length).toFixed(3)},平均带权周转时间为 ${(totalTurnaroundTimeWithWeight / this.processInfoArray.length).toFixed(3)}
            </div>
        `));
    }

    show() {

    }

    hide() {

    }
}