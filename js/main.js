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

        const loc = location.search;
        if (/f=|r=|s=/.test(loc)) {
            let search = loc.replace("?", "");
            let arr = search.split("&");
            let isForm = false;
            arr.map(x => {
                let opt = x.split("=")
                switch (opt[0]) {
                    case 'f':
                        isForm = true;
                        taskManager.setLayoutByValue({
                            value: opt[1],
                            searchingType: "searchByRadio",
                            notPushHistory: true,
                            Form: mealTypeForm,
                            sForm: mealSearchingForm,
                        });
                        break;
                    case 'r':
                        taskManager.generateRecipe({
                            notPushHistory: true,
                            value: opt[1]
                        });
                        break;
                }
            });
            if (isForm) mealTypeForm.setDefault("name");
        } else {
            mealTypeForm.setDefault("name");
        }

    } catch (e) {
        notificationHelper.update(e);
    }

})();