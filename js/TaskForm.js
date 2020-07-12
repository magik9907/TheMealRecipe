"use strict";
var TaskForm = function (selector) {
    if (!selector)
        throw new SelectorNotDefinedException(selector, this);
    this.$form = document.querySelector(selector);
    if (!(this.$form))
        throw FormNotFoundException(selector, this);
}

TaskForm.prototype.getData = function (selector) {
    const $element = $form.querySelector(selector);
    if (!$element)
        throw NullPointerException(this);
    return $element.value;
}

TaskForm.prototype.addEventToElements = function (selector, event, func) {
    const $elements = this.$form.querySelectorAll(selector);
    if (!$elements)
        throw NullPointerException(this);

    for (let i = 0, l = $elements.length; i < l; i++) {
        $elements[i].addEventListener(event, func);
    }
}

TaskForm.prototype.onSubmitEvent = function (func) {
    if (!func)
        throw NullPointerException(this);
    this.$form.addEventListener("submit", func);
}

//=========================================================

var TypeTaskForm = function (selector) {
    TaskForm.call(this, selector);
}
TypeTaskForm.prototype = Object.create(TaskForm.prototype);
TypeTaskForm.prototype.constructor = TypeTaskForm;

TypeTaskForm.prototype.setDefault = function (defOpt) {
    (this.$form).querySelector(`input[value="${defOpt}"]`).click();
}


//=========================================================

var SearchTaskForm = function (selector) {
    TaskForm.call(this, selector);
}
SearchTaskForm.prototype = Object.create(TaskForm.prototype);
SearchTaskForm.prototype.constructor = SearchTaskForm;
SearchTaskForm.prototype.searchParentByClass = function (elem, className) {
    while (!(elem.classList.contains(className))) {
        elem = elem.parentElement;
    }
    return elem;
}

SearchTaskForm.prototype.setLayout = function (layout) {

    const $div = (this.$form).querySelector(".js--changeField");

    if ($div) {
        $div.innerHTML = layout;
    }
}

SearchTaskForm.prototype.addClassName = function (elem, className) {
    if (elem)
        elem.classList.add(className);
}

SearchTaskForm.prototype.removeClassName = function (elem, className) {
    if (elem)
        elem.classList.remove(className);
}

SearchTaskForm.prototype.queryOption = function (value) {
    const regex = new RegExp(value + "", "gi");
    let $input;
    const searchAndAction = ($input) => {
        let elem = this.searchParentByClass($input, "input-row");
        return (func) => (func(elem));
    };

    (this.$options).forEach(element => {
        $input = element.querySelector("input");
        if ((value !== "" && $input.value.match(regex)) || (element.classList.contains("js--emptyOption") && value === "")) {
            searchAndAction(element)(
                (elem) => { this.removeClassName(elem, "display-none"); }
            );
        } else {         
            searchAndAction(element)(
                (elem) => { this.addClassName(elem, "display-none"); }
            );
        }
    });

}

SearchTaskForm.prototype.addEvents = function (textSelector, optionDivSelector) {
    this.$foDiv = (this.$form).querySelector(optionDivSelector);
    this.$inputText = (this.$form).querySelector(textSelector);

    if (this.$foDiv)
        this.$options = (this.$foDiv).querySelectorAll(".js--searchMealOption");

    //form option query, it remove or add class display-none to correct option
    const itFunction = (e) => {
        if (this.$options && this.$foDiv) {
            let $input = e.target;
            this.queryOption($input.value);
        }
    };
    //found option for input
    const foFunction = (e) => {
        let target = e.target;
        target = this.searchParentByClass(target, "js--searchMealOption");
        (this.$inputText).value = target.querySelector("input").value;
    };

    if (this.$foDiv)
        (this.$foDiv).addEventListener("click", foFunction);

    if (this.$inputText) {
        (this.$inputText).addEventListener("change", itFunction);
        (this.$inputText).addEventListener("keyup", itFunction);
    }
}

