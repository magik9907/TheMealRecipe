(function(){
    "use strict"
    taskManager.addHelper(rendererManager);
    taskManager.addHelper(notificationHelper);

    document.querySelector(".js--searchResults").addEventListener("click",function(e){
        
    },true);

    const mealForm = new TaskForm(".js--mealForm", "name",{
        'onSubmit': taskManager.onFormSubmit,
        'onLayoutChange':taskManager.setLayoutByValue
    });

})();