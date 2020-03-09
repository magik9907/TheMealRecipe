

taskManager = (function () {
    "use strict";
    var JSONListCopy = [];
    const addHelper = function (helper) {
        helpers.push(helper);
    };

    const notifyHelper = function (action, data = null) {
        do{
            for (let i = 0, l = helpers.length; i < l; i++) {
                helpers[i].update(action, data);
            }
        }while(false);
    };

    const setLayoutByValue = function (data) {
        
        let arrOption = ['categories', 'area', 'ingredients'];
        try {
            if (!data)
                throw "Bad data to generate searching form";
            // debugger;
            if(arrOption.includes(data.value) && !JSONListCopy[data.value])
                getSelectOption(data);
            else{
                data.json = JSONListCopy[data.value];
                notifyHelper("createFormLayout", data);
            }
        } catch (error) {
            console.log(error);
        }

    };

    const getSelectOption = (data) =>{
        let query = null;
        switch(data.value){
            case 'area':
                query = 'list.php?a=';
                break;
            case 'ingredients':
                query = 'list.php?i=';
                break;
            case 'categories':
                query = 'list.php?c=';
                break;
        }

        getData(query, data, function(data){
            notifyHelper('createFormLayout',data);
        });
    };

    const onFormSubmit = function (data){
        // value - how search ex by name
        //destination - -where put result
        //searchingType = value to search
        data.target = 'generateSearchResult';
        try {
            if (!data)
                throw "Bad data to generate searching form";
            let query = getQuery(data.searchingType);
            // console.log(query, data);
            
            getData(query, data, function(data){
                notifyHelper(data.target,data);
            });
        } catch (error) {
            console.log(error);
        }

    };

    const getQuery = ( key ) => {
        let queryList = {
            mealName: 'search.php?s=',
            flMealsName: 'search.php?f=',
            categorieMealsName: 'filter.php?c=',
            areaMealsName: 'filter.php?a=',
            ingredientsMealsName: 'filter.php?i='
        };

        return queryList[key];
    }

    const getData = function (query, mainData, callback){
        var key  = '1';
        fetch('https://www.themealdb.com/api/json/v1/'+key+'/'+query + mainData['value'])
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            JSONListCopy[mainData.value] = data;
            mainData.json = data;
            //console.log(mainData);
            
            callback(mainData);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    var helpers = [];

    return {
        addHelper: addHelper,
        setLayoutByValue: setLayoutByValue,
        onFormSubmit: onFormSubmit,
    };
})();