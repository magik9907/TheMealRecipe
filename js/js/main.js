(function(){
    "use strict"
    taskManager.addHelper(rendererManager);
    taskManager.addHelper(notificationHelper);

    const mealForm = new TaskForm(".js--mealForm", "name",{
        'onSubmit': taskManager.onFormSubmit,
        'onLayoutChange':taskManager.setLayoutByValue
    });

})();