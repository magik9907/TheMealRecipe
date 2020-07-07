var notificationHelper = (function(){
    "use strict";

    const update = (action, data = null) =>{
        console.group(action);
        (action === "error")? console.error(data.message,data) : console.log(data);
        console.groupEnd();

    }

    return Object.freeze({
        update:update,
    });
})();