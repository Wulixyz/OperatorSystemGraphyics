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
class Display extends AnimationObjectBase {
    constructor() {
        super();
        
    }
}
class Menu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
            <div style='height:100vh;width:100vw'>
                <div class='menu'>
                    <div class='input_and_random'>
                        <div class="select_by_input d-grid gap-2.5 col-6 mx-auto">
                            <button class="select_by_input_button btn btn-primary" type="button">自己输入</button>
                        </div>
                        <div class="select_by_random d-grid gap-2.5 col-6 mx-auto">
                            <button class="select_by_random_button btn btn-primary" type="button">随机生成</button>
                        </div>
                    </div>
                    <div class='select_check'>
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
                    <div class='submit_button'>
                        <div class="d-grid gap-2.5 col-6 mx-auto">
                            <button class="select_by_random btn btn-primary" type="button">提交</button>
                        </div>
                    </div>
                </div>
            </div>
        `)

        // this.$menu.hide();
        this.$select_by_input = this.$menu.find('.select_by_input');
        this.$select_by_input_button = this.$menu.find('.select_by_input_button');
        this.root.$schedule.append(this.$menu);
        
        this.start();
    }

    start() {
        this.add_listen_events();
    }
    
    add_listen_events() {
        let outer = this;
        outer.$select_by_input_button.click(function() {
            outer.$select_by_input_button.hide();
        });
    }
}
class Result {
    constructor() {
        
    }
}
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
