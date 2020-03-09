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
                formData.destination = '.js--searchResult';
                funcList.onSubmit(formData);
            }, true);

        $chkboxDiv.addEventListener('click',
            function (e) {
                if (e.target.classList.contains('js--whatSearchRadio')) {
                    data.value = e.target.value;
                    funcList.onLayoutChange(data);
                }
            }, false);

        self.setDefaultInput($chkboxDiv, data, funcList.onLayoutChange);
    }

    setDefaultInput($chkboxDiv, data, layoutFunc) {
        // debugger;
        this.setChecked($chkboxDiv, data);
        layoutFunc(data);
    }

    setChecked($div, data) {
        $div.querySelector(`[value=${data.value}]`).checked = true;
    }

    getFormData($form) {
        //debugger;
        var $input = $form.querySelector(".js--searchMeal");
        //console.log($input.value);
        
        return {
            searchingType : $input.name,
            value: $input.value
        }
    }

}
