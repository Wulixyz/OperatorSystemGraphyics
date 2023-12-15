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

        this.$input_box = $(`
            <div class="input_box">
                <div class="form-floating">
                    <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea"></textarea>
                    <label for="floatingTextarea">Comments</label>
                </div>
            </div>
        `)

        // this.$menu.hide();
        this.$select_by_input = this.$menu.find('.select_by_input');
        this.$select_by_input_button = this.$menu.find('.select_by_input_button');
        this.$submit_button = this.$menu.find('.submit_button');

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
