(function(){
    "use strict"
    taskManager.addHelper(rendererManager);
//    taskManager.addHelper(notificationHelper);

    document.querySelector(".js--searchResult").addEventListener("click", function(e){
        let anchor = null;
        e.preventDefault();
        let i = 0;
        do{
            anchor = (e.path[i].localName == 'a' )?e.path[i]:null; 
            i++;
        }while( anchor == null);
        anchor = anchor.href.split('/').pop();
        
        taskManager.generateRecipe({value:anchor});
    },true);    
    
    const mealForm = new TaskForm(".js--mealForm", "name",{
        'onSubmit': taskManager.onFormSubmit,
        'onLayoutChange':taskManager.setLayoutByValue
    });

})();