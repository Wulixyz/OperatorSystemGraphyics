class Menu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
            <div class='background'>
                <div class='menu'>
                    <div class='input_and_random'>
                        <div class="input_form col-md-4 mx-auto">
                        </div>
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
                            <button class="submit_button btn btn-primary" type="button">提交</button>
                        </div>
                    </div>
                </div>
            </div>
        `)

        this.$input_group = $(`
            <div class="input-group">
                <span class="input-group-text" id="inputGroup-sizing-default">Process Info</span>
                <input type="text" placeholder="ProcessName" class="form-control">
                <input type="text" placeholder="ArrivalTime" class="form-control">
                <input type="text" placeholder="Priority" class="form-control">
                <input type="text" placeholder="BurstTime" class="form-control">
                <button type="button" class="btn btn-danger">delete</button>
            </div>
        `)


        // this.$menu.hide();
        this.$select_by_input = this.$menu.find('.select_by_input');
        this.$select_by_random = this.$menu.find('.select_by_random');
        this.$select_by_input_button = this.$menu.find('.select_by_input_button');
        this.$select_by_random_button = this.$menu.find('.select_by_random_button');
        this.$input_form = this.$menu.find('.input_form');
        this.$submit_button = this.$menu.find('.submit_button');

        this.$input_form.hide();

        this.root.$schedule.append(this.$menu);
        this.$input_form.append(this.$input_group);
        
        this.start();
    }

    start() {
        this.add_listen_events();
    }
    
    add_listen_events() {
        let outer = this;

        this.$select_by_input_button.click(() => {
            outer.$select_by_input_button.hide();
            outer.$select_by_random_button.show();
            outer.$input_form.show();
        });

        this.$select_by_random_button.click(() => {
            outer.$select_by_random_button.hide();
            outer.$select_by_input_button.show();
            outer.$input_form.hide();
        });

        this.$input_group.on('keyup','input-group:child',(e) => {
            if(e.key == 'Enter') {
                $this.$input_form.append(this.$input_group.clone());
            }
        });
    }
}
