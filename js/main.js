//function to control div open/close
const openerArrow = (e) => {
    let selectBar = e;
    while (!(selectBar.classList.contains("js--select-bar"))) {
        selectBar = selectBar.parentElement;
    }
    selectBar.classList.toggle("open");
}

let mealTypeForm;
let mealSearchingForm;
try {
    mealTypeForm = new TypeTaskForm(".js--mealTypeForm");
    mealSearchingForm = new SearchTaskForm(".js--mealSearchingForm");
} catch (error) {
    notificationHelper.update("error", error)
}

(function () {
    "use strict";

    taskManager.addHelper(rendererHelper);
    taskManager.addHelper(notificationHelper);
    taskManager.addHelper(urlHelper);

    try {
        document.querySelector(".js--searchResult").addEventListener("click", function (e) {
            e.preventDefault();

            let anchor = null;
            let i = 0;

            do {
                anchor = (e.path[i].localName === 'a') ? e.path[i] : null;
                i++;
            } while (anchor == null && (e.path[i].localName != 'main' || e.path[i].localName != 'a'));
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
            e.preventDefault();
            const state = e.state;
            if (state == null) return;
            state.notPushHistory = true;
            console.log("POP", state);

            switch (state.target) {
                case 'createRecipe':
                    taskManager.generateRecipe(state);
                    break;
                case 'createFormLayout':
                    state.Form = mealTypeForm;
                    state.sForm = mealSearchingForm;
                    taskManager.setLayoutByValue(state);
                    break;
                case 'generateSearchResult':
                    let $input = mealSearchingForm.querySelector("input[type=\"text\"]");
                    $input.value = state.value;
                    taskManager.onFormSubmit(state);
                    break;
            }
        }, false);
    } catch (e) {
        notificationHelper.update(e);
    }
})();

const onLoadAction = (function () {

    const search = (x) => {
        let $input = mealSearchingForm.querySelector("input[type=\"text\"]");
        $input.value = x;
        mealSearchingForm.querySelector("button").click();
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
    }

    const recipe = (x) => {
        taskManager.generateRecipe({
            notPushHistory: true,
            value: x
        });
    }

    const load = () => {
        const searchLoc = location.search.replace("?", "");
        const arr = searchLoc.split("&");
        let opt;
        const f = /f=/;
        const r = /r=/;
        const s = /s=/;
        var isForm = false;

        if (f.test(searchLoc)) {
            opt = arr.filter(x => f.test(x));
            form(opt[0].split("=")[1]);
            isForm = true;
        } else {
            mealTypeForm.setDefault("name");
        }

        if (r.test(searchLoc)) {
            opt = arr.filter(x => r.test(x));
            recipe(opt[0].split("=")[1]);
        }

        if (s.test(searchLoc) && isForm) {
            setTimeout(() => {
                opt = arr.filter(x => s.test(x));
                search(opt[0].split("=")[1]);
            }, 1000);
        }
    }

    return {
        load: load
    }

})();

onLoadAction.load();