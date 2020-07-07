
class SelectorNotDefinedException {
    constructor(selector, object) {
        this.message = "Selector is undifiened.\n Current value: " + ((!selector) ? "null" : selector);
        this.name = "selectorNotDefinedException";
        this.path = object;
    }
}

class NullPointerException {
    constructor(object) {
        this.message = "Null as a value"
        this.name = "NullPointerException";
        this.path = object;
    }
}

class FormNotFoundException {
    constructor(selector, object) {
        this.message = "Form not found using selector";
        this.selector = selector;
        this.name = "FormNotFoundException";
        this.path = object;
    }
}