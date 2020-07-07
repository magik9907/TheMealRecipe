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

    taskManager.addHelper(rendererManager);
    taskManager.addHelper(notificationHelper);
    document.querySelector(".js--searchResult").addEventListener("click", function (e) {
        e.preventDefault();

        let anchor = null;
        let i = 0;

        do {
            anchor = (e.path[i].localName == 'a') ? e.path[i] : null;
            i++;
        } while (anchor == null);

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
    mealTypeForm.setDefault("name");
})();