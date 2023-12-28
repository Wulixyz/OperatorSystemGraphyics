class Menu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
            <div class='background'>
                <div class='menu'>
                    <div class='input-and-random'>
                        <div class="input-form col-md-4 mx-auto"></div>
                        <div class="select-by-input d-grid gap-2.5 col-6 mx-auto">
                            <button class="menu-button add-info-button btn btn-success" type="button">+add</button>
                            <button class="menu-button select-by-input-button btn btn-primary" type="button">自己输入</button>
                        </div>
                        <div class="select-by-random d-grid gap-2.5 col-6 mx-auto">
                            <button class="menu-button select-by-random-button btn btn-primary" type="button">随机生成</button>
                        </div>
                    </div>
                    <div class='mode-select select-check'>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1">
                            <label class="form-check-label" for="inlineCheckbox1">FCFS</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" id="inlineCheckbox2" value="option2">
                            <label class="form-check-label" for="inlineCheckbox2">SJF</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" id="inlineCheckbox3" value="option3">
                            <label class="form-check-label" for="inlineCheckbox3">HPF</label>
                        </div>
                    </div>
                    <div class='submit-button-field'>
                        <div class="d-grid gap-2.5 col-6 mx-auto">
                            <button class="menu-button submit-button btn btn-primary" type="button">提交</button>
                        </div>
                    </div>
                </div>
            </div>
        `)

        // this.$menu.hide();
        this.$selectByInput = this.$menu.find('.select-by-input');
        this.$selectByRandom = this.$menu.find('.select-by-random');
        this.$selectByInputButton = this.$menu.find('.select-by-input-button');
        this.$selectByRandomButton = this.$menu.find('.select-by-random-button');
        this.$inputForm = this.$menu.find('.input-form');
        this.$addInfoButton = this.$selectByInput.find('.add-info-button');
        this.$selectMode = this.$menu.find('.mode-select');
        this.$submitButton = this.$menu.find('.submit-button');

        this.$inputForm.hide();
        this.$addInfoButton.hide();

        this.addNewInputGroup();

        this.root.$schedule.append(this.$menu);

        this.isRandom = true;
        this.seed = Math.floor(Math.random() * 10000);  // 生成随机种子
        this.generator = new Math.seedrandom(this.seed);  // 随机数生成器

        this.colors = ["#00A86B","#FF4500","#317873"," #8A2BE2","#00416A"];
        
        this.start();
    }

    start() {
        this.addListenEvents();
    }
    
    addListenEvents() {
        let outer = this;

        this.$selectByInputButton.click(() => {
            outer.$selectByInputButton.prop('disabled', true);
            outer.$selectByRandomButton.prop('disabled',false);
            outer.$inputForm.show();
            outer.$addInfoButton.show();
    
            outer.isRandom = false;
        });

        this.$selectByRandomButton.click(() => {
            outer.$selectByInputButton.prop('disabled', false);
            outer.$selectByRandomButton.prop('disabled',true);
            outer.$inputForm.hide();
            outer.$addInfoButton.hide();

            outer.isRandom = true;
        });

        this.$addInfoButton.click(() => {
            outer.addNewInputGroup();
        });

        this.$inputForm.on('click', '.input-group-delete-button', function() {
            // 在这里处理删除操作
            $(this).closest('.input-group').remove();
        });

        this.$submitButton.click(() => {
            let processInfoArray = [];

            if(outer.isRandom === false) {
                outer.$inputForm.find('.input-group').each(function() {
                    const inputValues = $(this).find('input').map(function() {
                        return $(this).val();
                    }).get();
                    processInfoArray.push({
                        'processName': inputValues[0],
                        'arrivalTime': parseFloat(inputValues[1]),
                        'priority': parseFloat(inputValues[2]),
                        'burstTime': parseFloat(inputValues[3]),
                    });
                });
            } else {
                const processCount = this.generateRandomInt(5, 10);
                let dividedId = 1;

                for (var i = 1; i <= processCount; i++) {
                    processInfoArray.push({
                        'processName': "P" + dividedId,
                        'arrivalTime': this.generateRandomDouble(2,5),
                        'priority': this.generateRandomDouble(1,20),
                        'burstTime': this.generateRandomDouble(2,5),
                    });
                    dividedId ++;
                }
            }

            for(let i = 0;i < processInfoArray.length;i ++ ) {
                processInfoArray[i]['blockColor'] = this.colors[this.generateRandomInt(0,this.colors.length - 1)];
            }

            outer.getSelectMode();
            outer.addProcessArray = processInfoArray;

            if(outer.selectMode.length < 1) {
                alert("请至少选择一种模式");
            } else {
                console.log(outer.addProcessArray);
                outer.hide();
                outer.root.processRunnerControl.start();
                outer.root.display.show();
            }
        });
    }

    show() {
        this.$menu.show();
    }

    hide() {
        this.$menu.hide();
    }

    generateRandomDouble(l,r) {  // 生成范围在 l 到 r 之间的均匀分布的浮点数
        return this.generator() * (r - l) + l;
    }

    generateRandomInt(l,r) {  // 生成范围在 l 到 r 之间的均匀分布的整数
        return Math.floor(this.generator() * (r - l + 1)) + l;
    }

    getSelectMode() {
        let modes = ['FCFS','SJF','HPF'];
        let modeIsSelect = this.$selectMode.find('.form-check-input').map(function() {
            return $(this).is(':checked');
        }).get();

        this.selectMode = [];
        for(let i = 0;i < modeIsSelect.length;i ++ ) {
            if(modeIsSelect[i]) this.selectMode.push(modes[i]);
        }
    }

    addNewInputGroup() {
        const newInputGroup = $(`
            <div class="input-group">
                <span class="input-group-text" id="inputGroup-sizing-default">Process Info</span>
                <input type="text" placeholder="ProcessName" class="form-control">
                <input type="text" placeholder="ArrivalTime" class="form-control">
                <input type="text" placeholder="Priority" class="form-control">
                <input type="text" placeholder="BurstTime" class="form-control">
                <button type="button" class="input-group-delete-button btn btn-danger">delete</button>
            </div>
        `);
        this.$inputForm.append(newInputGroup);
    }
}
