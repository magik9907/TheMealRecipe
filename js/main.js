//function to control div open/close
const openerArrow = (e) => {
    let selectBar = e;
    while (!(selectBar.classList.contains("js--select-bar"))) {
        selectBar = selectBar.parentElement;
    }
    selectBar.classList.toggle("open");
}


(function () {
    "use strict";
    let mealTypeForm;
    let mealSearchingForm;

    try {
        mealTypeForm = new TypeTaskForm(".js--mealTypeForm");
        mealSearchingForm = new SearchTaskForm(".js--mealSearchingForm");
    } catch (error) {
        notificationHelper.update("error", error)
    }

    taskManager.addHelper(rendererHelper);
    taskManager.addHelper(notificationHelper);
    taskManager.addHelper(urlHelper);

    try {
        document.querySelector(".js--searchResult").addEventListener("click", function (e) {
            e.preventDefault();

            let anchor = null;
            let i = 0;

            do {
                anchor = (e.path[i].localName == 'a') ? e.path[i] : null;
                i++;
            } while (anchor == null && e.path[i].localName == 'main');
            if (anchor == null) return;
            anchor = anchor.href.split('/').pop();

            taskManager.generateRecipe({ value: anchor });
        }, true);

        mealTypeForm.addEventToElements(".input-row", "click", function (e) {
            let $inputRow = e.target;
            let $input;
            let $rowsContainer = null;
            let data = null;

            while (!($inputRow.classList.contains("input-row"))) {
                $inputRow = $inputRow.parentElement;
            }

            $input = $inputRow.querySelector("input[type=\"radio\"]");

            if ($input.checked) {
                if (($rowsContainer = $inputRow.parentElement.querySelector(".order-1")))
                    $rowsContainer.classList.remove("order-1");
                $inputRow.classList.add("order-1");

                data = {
                    value: $input.value,
                    searchingType: $input.name,
                    Form: mealTypeForm,
                    sForm: mealSearchingForm,
                };
                taskManager.setLayoutByValue(data);
            }
        });

        mealSearchingForm.onSubmitEvent((e) => {
            e.preventDefault();
            let $input = e.target.querySelector(".js--searchMeal");
            taskManager.onFormSubmit({
                value: $input.value.toLowerCase(),
                searchingType: $input.name
            });
        });


        window.addEventListener('popstate', (e) => {
            console.log(e);
            const state = e.state;
            state.notPushHistory = true;
            switch (state.target) {
                case 'createRecipe': taskManager.generateRecipe(state); break;
                case 'createFormLayout': taskManager.setLayoutByValue(state); break;
                case 'generateSearchResult': taskManager.onFormSubmit(state); break;
            }


        }, false);

        const setView = function (arr) {

            const search = (x) => {
                if (isForm === true) {
                    mealSearchingForm.querySelector("input[type=\"text\"]").value = x;
                    mealSearchingForm.querySelector("button").click();
                    return true;
                } else {
                    return false;
                }
            }

            const form = (x) => {
                let $selector = mealTypeForm.querySelector(".order-1");
                if ($selector)
                    $selector.classList.remove("order-1");
                $selector = mealTypeForm.querySelector(`[value="${x}"]`);
                if ($selector) {
                    while (!($selector.classList.contains("input-row"))) {
                        $selector = $selector.parentElement;
                    }
                    $selector.classList.add("order-1");
                }
                taskManager.setLayoutByValue({
                    value: x,
                    searchingType: "searchByRadio",
                    notPushHistory: true,
                    Form: mealTypeForm,
                    sForm: mealSearchingForm,
                });
                isForm = true;
                return true;
            }

            const recipe = (x) => {
                taskManager.generateRecipe({
                    notPushHistory: true,
                    value: x
                });
                return true;
            }

            const callback = x => {
                let opt = x.split("=")
                switch (opt[0]) {
                    case "s":
                        if (/f=/.test(loc))
                            return !(search(opt[1]));
                        return false;
                        break;
                    case 'f':
                        return !(form(opt[1]));
                        break;
                    case 'r':
                        return !(recipe(opt[1]));
                        break;
                }
            }

            while (arr.length != 0) {
                arr = arr.filter(callback);
            }

            if (!isForm) mealTypeForm.setDefault("name");
        }

        const loc = location.search;
        if (/f=|r=|s=/.test(loc)) {
            let search = loc.replace("?", "");
            let arr = search.split("&");
            var isForm = false;
            setView(arr);
        } else {
            mealTypeForm.setDefault("name");
        }



    } catch (e) {
        notificationHelper.update(e);
    }

})();