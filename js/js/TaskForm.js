"use strict";
var TaskForm = function (selector) {
    this.$form = document.querySelector(selector);
}

TaskForm.prototype.getData = function (selector) {
    let $element = $form.querySelector(selector);
    if (!$element)
        throw "Null pointer";
    return $element.value;
}

TaskForm.prototype.setData = function (selector, data) {
    throw "set data";
}

TaskForm.prototype.addEventToElements = function (selector, event, func) {
    let $elements = this.$form.querySelectorAll(selector);
    if ($elements)
        for (let i = 0, l = $elements.length; i < l; i++) {
            $elements[i].addEventListener(event, func);
        }
}

TaskForm.prototype.onSubmitEvent = function (func) {
    this.$form.addEventListener("submit", func);
}

//=========================================================

var TypeTaskForm = function (selector, searchFormSelector) {
    this.$searchForm = document.querySelector(searchFormSelector);
    TaskForm.call(this, selector);
}
TypeTaskForm.prototype = Object.create(TaskForm.prototype);
TypeTaskForm.prototype.constructor = TypeTaskForm;

TypeTaskForm.prototype.setLayout = function (layout) {
    let $div = (this.$searchForm).querySelector(".js--changeField");

    if ($div) {
        $div.innerHTML = layout;
    }
}


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
SearchTaskForm.prototype.addClassName = function (elem, className) {
    elem.classList.add(className);
}

SearchTaskForm.prototype.removeClassName = function (elem, className) {
    elem.classList.remove(className);
}

SearchTaskForm.prototype.queryOption = function (value) {
    
    let regex = new RegExp(value + "", "gi");
    let elem;
    let ifFound = false;


    for (let i = 0, l = (this.$options).length; i < l; i++) {
        elem = ((this.$options)[i]).querySelector("input");
        if (value != "" && elem.value.match(regex)) {
            elem = this.searchParentByClass((this.$options)[i], "input-row");
            this.removeClassName(elem, "display-none");
            ifFound = true;
        } else {
            elem = this.searchParentByClass((this.$options)[i], "input-row");
            this.addClassName(elem, "display-none");
        }
    }
}
SearchTaskForm.prototype.addEvents = function (textSelector, optionDivSelector) {
    this.$foDiv = (this.$form).querySelector(optionDivSelector);
    this.$inputText = (this.$form).querySelector(textSelector);

    if (this.$foDiv)
        this.$options = (this.$foDiv).querySelectorAll(".js--searchMealOption");


    let itFunction = (e) => {
        if (this.$options && this.$foDiv) {
            let $input = e.target;
            this.queryOption($input.value);
        }
        return;
    };

    let foFunction = (e) => {
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

