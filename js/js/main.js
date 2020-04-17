(function () {
    "use strict"
    taskManager.addHelper(rendererManager);
    //    taskManager.addHelper(notificationHelper);

    document.querySelector(".js--searchResult").addEventListener("click", function (e) {
        let anchor = null;
        e.preventDefault();
        let i = 0;
        do {
            anchor = (e.path[i].localName == 'a') ? e.path[i] : null;
            i++;
        } while (anchor == null);
        anchor = anchor.href.split('/').pop();

        taskManager.generateRecipe({ value: anchor });
    }, true);

    const mealTypeForm = new TypeTaskForm(".js--mealTypeForm", ".js--mealSearchingForm");
    const mealSearchingForm = new SearchTaskForm(".js--mealSearchingForm");
    mealTypeForm.addEventToElements(".input-row", "click", function (e) {
        let $inputRow = e.target;
        while (!($inputRow.classList.contains("input-row"))) {
            $inputRow = $inputRow.parentElement;
        }
        let $input = $inputRow.querySelector("input[type=\"radio\"");
        let $rowsContainer = null;
        if ($input.checked) {
            if (($rowsContainer = $inputRow.parentElement.querySelector(".order-1")))
                $rowsContainer.classList.remove("order-1");
            $inputRow.classList.add("order-1");

            let data = {
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