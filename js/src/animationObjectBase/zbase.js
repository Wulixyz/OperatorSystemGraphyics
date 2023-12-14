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