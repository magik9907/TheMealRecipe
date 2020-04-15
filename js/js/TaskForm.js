"use strict";
class TaskForm {
    constructor(formSelector, defaultInput, funcList) {
        var self = this;
        var $form = document.querySelector(formSelector);
        var $chkboxDiv = $form.querySelector('.js--chkboxDiv');
        var data = {
            selector: $form.querySelector('.js--fieldToChange'),
            value: defaultInput
        };

        $form.addEventListener('submit',
            function (e) {
                e.preventDefault();
                var formData = self.getFormData($form);
                funcList.onSubmit(formData);
            }, true);

        $chkboxDiv.addEventListener('click',
            function (e) {
                if (e.target.classList.contains('js--whatSearchRadio') && !(e.target.parentElement.classList.contains('order-1'))) {


                    self.removeOrder(e.target);
                    data.value = e.target.value;
                    let $selector = e.target;
                    while (!($selector.classList.contains("order-2"))) {
                        $selector = $selector.parentElement;
                    }
                    $selector.classList.add("order-1");
                    funcList.onLayoutChange(data);
                }
            }, false);

        self.setDefaultInput($chkboxDiv, data, funcList.onLayoutChange);
    }

    removeOrder($input) {
        let $div = $input;
        while (!($div.classList.contains("js--chkboxDiv"))) {
            $div = $div.parentElement;
        }

        $div.parentElement.querySelector(`.order-1`).classList.remove("order-1");
    }

    setDefaultInput($chkboxDiv, data, layoutFunc) {

        this.setChecked($chkboxDiv, data);
        this.addOrder($chkboxDiv, data);
        layoutFunc(data);
    }

    addOrder($div, data) {
        let $selector = $div.querySelector(`[value=${data.value}]`);
        while (!($selector.classList.contains("order-2"))) {
            $selector = $selector.parentElement;
        }
        $selector.classList.add("order-1");
    }

    setChecked($div, data) {
        $div.querySelector(`[value=${data.value}]`).checked = true;
    }

    getFormData($form) {

        var $input;
        if (!($input = $form.querySelector(".selected")))
            $input = $form.querySelector(".js--searchMeal");
        else {
            $input = $input.querySelector("input");
        }
        return {
            searchingType: $input.name,
            value: $input.value
        }
    }

}
