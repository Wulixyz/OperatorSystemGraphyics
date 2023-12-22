let ANIMATION_OBJECT = [];

class AnimationObjectBase {
  constructor() {
    ANIMATION_OBJECT.push(this);
    this.is_started = false;
    this.timedelta = 0;

    this.uuid = this.creat_uuid();
  }

  creat_uuid() {
    let res = "";
    for (let i = 0; i < 8; i++) {
      let x = parseInt(Math.floor(Math.random() * 10)); // 创建一个0 ~ 9的数字
      res += x;
    }
    return res;
  }

  start() {
    // 开始时执行一次
  }

  update() {
    // 每帧执行一次
  }

  late_update() { 
    // 每一帧最后执行一次
  }

  on_destroy() {
    // 销毁前执行一次
  }

  destroy() {
    // 销毁
    this.on_destroy()

    for(let i = 0;i < ANIMATION_OBJECT.length;i ++ ) {
      if(ANIMATION_OBJECT[i] === this) {
        ANIMATION_OBJECT.splice(i,1);
        break;
      }
    }
  }
}

let last_timestamp;
let ANIMATION = function(timestamp) {
  for(let i = 0;i < ANIMATION_OBJECT.length;i ++ ) {
    if(!ANIMATION_OBJECT[i].is_started) {
      ANIMATION_OBJECT[i].is_started = true;
      ANIMATION_OBJECT[i].start();
    } else {
      ANIMATION_OBJECT[i].timedelta = timestamp - last_timestamp;
      ANIMATION_OBJECT[i].update();
    }
  }

  for(let i = 0;i < ANIMATION_OBJECT.length;i ++ ) {
    ANIMATION_OBJECT[i].late_update();
  }
  
  last_timestamp = timestamp;

  requestAnimationFrame(ANIMATION);
}

requestAnimationFrame(ANIMATION);
class DisplayBackground extends AnimationObjectBase {
    constructor(display) {
        super();
        this.display = display;
        this.$canvas = $(`<canvas tabindex=0></canvas>`);

        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.display.width;
        this.ctx.canvas.height = this.display.height;
        this.display.$display.append(this.$canvas);
    }

    start() {
        this.$canvas.focus();
    }

    resize() {
        this.ctx.canvas.height = this.display.height;
        this.ctx.canvas.width = this.display.width;
        this.ctx.fillStyle = "rgba(138,210,223,1)";
        this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
    }

    update() {
        this.render();
    }

    render() {
        this.ctx.fillStyle = "rgba(138,210,223,1)";
        this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
    }
}class LineProcessGroup extends AnimationObjectBase {
    constructor(root,pos,width,height,mode) {
        super();
        this.root = root;
        this.ctx = this.root.ctx;
        this.mode = mode;
        this.pos = pos;

        this.width = width;
        this.height = height;
        this.scale = this.root.scale;

        this.topLeft = [this.pos[0],this.pos[1] - this.height / 2];
        this.bottomLeft = [this.pos[0],this.pos[1] + this.height / 2];
        this.topRight = [this.pos[0] + this.width,this.pos[1] - this.height / 2];
        this.bottomRight = [this.pos[0] + this.width,this.pos[1] + this.height / 2];
    }

    update() {
        this.render();
    }

    render() {
        this.renderLine();
        this.renderMode();
    }

    renderLine() {
        this.drawLine(this.topLeft,this.topRight);
        this.drawLine(this.topLeft,this.bottomLeft);
        this.drawLine(this.bottomLeft,this.bottomRight);
    }

    renderMode() {
        this.ctx.font = "20px Arial";
        this.ctx.save();
        this.ctx.translate(this.bottomLeft[0] - 0.02 * this.scale,this.bottomLeft[1] - 0.01 * this.scale);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillStyle = "black";
        this.ctx.fillText(this.mode,0,0);
        this.ctx.restore();
    }

    drawLine(pos1,pos2) {
        this.ctx.beginPath();
        this.ctx.moveTo(pos1[0],pos1[1]);
        this.ctx.lineTo(pos2[0],pos2[1]);
        this.ctx.stroke();
    }
}class ProcessBlock extends AnimationObjectBase {
    constructor(root,pos,width,height) {
        super();
        this.root = root;
        this.ctx = this.root.ctx;
        this.width = width;
        this.height = height;
        this.scale = this.root.scale;
        this.pos = pos;

        this.pos1 = [this.pos[0],this.pos[1] - this.height / 2];
    }

    update() {
        this.render();
    }

    render() {
        this.renderBlock();
        this.renderProcessName();
    }

    renderBlock() {
        this.ctx.fillStyle = "rgba(242,232,60,1)";
        this.ctx.fillRect(this.pos1[0],this.pos1[1],this.width,this.height);
    }

    renderProcessName() {

    }
}class ProcessHandleGroup extends AnimationObjectBase {
    constructor(display,pos,selectMode) {
        super();
        this.display = display;
        this.ctx = this.display.ctx;
        this.processInfoArray = this.display.processInfoArray;
        this.scale = this.display.scale;
        this.power = 0.18;
        this.height = 0.5 * this.scale;
        this.width = 0.36 * this.scale;

        this.pos = pos;
        this.selectMode = selectMode;

        this.completeProcess = new LineProcessGroup(this,[this.pos[0] - this.width / 2,this.pos[1] + 0.15 * this.scale],this.width,0.13 * this.scale,"Completed");
    }

    show() {

    }

    update() {
        this.render();
    }

    render() {
        this.renderBottomLine();
        this.renderTwoSidesLine();
        this.renderBottomMessage();
        this.renderProcessBlock();
    }

    renderBottomLine() {
        this.drawLine(this.pos[0] - this.power * this.scale,this.pos[1],this.pos[0] + this.power * this.scale,this.pos[1]);
    }

    renderBottomMessage() {
        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.fillText(this.selectMode,this.pos[0] - 0.04 * this.scale,this.pos[1] + 0.05 * this.scale);
    }
    
    renderTwoSidesLine() {
        this.drawLine(this.pos[0] - this.power * this.scale,this.pos[1],this.pos[0] - this.power * this.scale,this.pos[1] - 0.5 * this.scale);
        this.drawLine(this.pos[0] + this.power * this.scale,this.pos[1],this.pos[0] + this.power * this.scale,this.pos[1] - 0.5 * this.scale);
    }

    renderProcessBlock() {
        // this.proccessBlock = new ProcessBlock(this,this.pos,[this.pos[0] + this.width,this.pos[1] + this.height]);

    }

    drawLine(x1,y1,x2,y2) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1,y1);
        this.ctx.lineTo(x2,y2);
        this.ctx.stroke();
    }
}class ProcessWaitGroup extends AnimationObjectBase {
    constructor(display) {
        super();
        this.display = display;

        this.ctx = this.display.ctx;
        this.scale = this.display.scale;
        this.width = 0.7 * this.scale;
        this.height = 0.14 * this.scale;
        this.pos = [0.3 * this.display.width,0.1 * this.display.height];

        this.PBWidth = this.width / 5;
        this.height = this.height;
        this.waitProcessInfo = this.display.processInfoArray;

        this.groupGraphyics = new LineProcessGroup(this,this.pos,this.width,this.height,"Waitting");
    }

    render() {
        
    }

    update() {
        this.render();
    }
}class Display extends AnimationObjectBase {
    constructor(root) {
        super();
        this.root = root;
        this.ModuleFactory = this.root.ModuleFactory;
        this.$display = $(`<div class='schedule-display'></div>`);
        this.root.$schedule.append(this.$display);

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
        this.processInfoArray = this.root.menu.processInfoArray;
        this.selectMode = this.root.menu.selectMode;
        console.log(this.selectMode);

        this.displayBackground = new DisplayBackground(this);

        this.ctx = this.displayBackground.ctx;

        this.processWaitGroup = new ProcessWaitGroup(this);
        
        this.processHandleGroups = [];
        for(let i = 0;i < this.selectMode.length;i ++ ) {
            this.processHandleGroups.push(new ProcessHandleGroup(this,[this.width / (this.selectMode.length + 1) * (i + 1),this.height * 0.75],this.selectMode[i]));
        }
        // for(let i = 1;i <= 3;i ++ ) {
        //     this.processHandleGroups.push(new ProcessHandleGroup(this,[this.width / 4 * i,this.height * 0.75],"FCFS"));
        // }
        
        this.resize();

        this.$display.show();
    }

    hide() {
        this.$display.hide();
    }
}
class Menu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
            <div class='background'>
                <div class='menu'>
                    <div class='input-and-random'>
                        <div class="input-form col-md-4 mx-auto"></div>
                        <div class="select-by-input d-grid gap-2.5 col-6 mx-auto">
                            <button class="add-info-button btn btn-success" type="button" style="margin:1%">+add</button>
                            <button class="select-by-input-button btn btn-primary" type="button">自己输入</button>
                        </div>
                        <div class="select-by-random d-grid gap-2.5 col-6 mx-auto">
                            <button class="select-by-random-button btn btn-primary" type="button">随机生成</button>
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
                            <button class="submit-button btn btn-primary" type="button">提交</button>
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
        
        this.start();
    }

    start() {
        this.addListenEvents();
    }
    
    addListenEvents() {
        let outer = this;

        this.$selectByInputButton.click(() => {
            outer.showSelectByInput();

            outer.isRandom = false;

            outer.$selectByRandom.hide();
            outer.$selectByInputButton.hide();
        });

        this.$selectByRandomButton.click(() => {
            outer.hideSelectByInput();

            outer.isRandom = true;
            
            outer.$selectByRandom.show();
            outer.$selectByInputButton.show();
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
                        'arrivalTime': inputValues[1],
                        'priority': inputValues[2],
                        'burstTime': inputValues[3],
                    });
                });
            } else {
                const processCount = this.generateRandomInt(5, 10);
                let dividedId = 1;

                for (var i = 1; i <= processCount; i++) {
                    processInfoArray.push({
                        'processName': "P" + dividedId,
                        'arrivalTime': this.generateRandomDouble(1,10),
                        'priority': this.generateRandomDouble(1,10),
                        'burstTime': this.generateRandomDouble(1,10),
                    });
                    dividedId ++;
                }
            }

            outer.getSelectMode();
            outer.processInfoArray = processInfoArray;

            if(outer.selectMode.length < 1) {
                alert("请至少选择一种模式");
            } else {
                outer.hide();
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

    showSelectByInput() {
        this.$selectByInput.show();
        this.$addInfoButton.show();
        this.$selectByRandomButton.show();
        this.$inputForm.show();
    }

    hideSelectByInput() {
        this.$selectByInput.hide();
        this.$selectByRandomButton.hide();
        this.$addInfoButton.hide();
        this.$inputForm.hide();
    }
}
class Result {
    constructor() {
        
    }
}
export class Schedule {
    constructor(id,ModuleFactory) {
        this.id = id;
        this.ModuleFactory = ModuleFactory;
        this.$schedule = $('#' + id);

        this.menu = new Menu(this);
        this.display = new Display(this);
        this.result = new Result(this);

        this.start();
    }

    start() {
        
    }
}
