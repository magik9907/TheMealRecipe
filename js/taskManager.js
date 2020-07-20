

taskManager = (function () {
    "use strict";
    //===============================================
    // settings:
    // define if function getData() send request to server:
    const sendrequest = true;

    //===============================================
    var helpers = [];
    var JSONListCopy = [];

    const addHelper = function (helper) {
        helpers.push(helper);
    };

    const notifyHelper = function (action, data = null) {
        for (let i = 0, l = helpers.length; i < l; i++) {
            helpers[i].update(action, data);
        }
    };

    const setLayoutByValue = function (data) {

        let arrOption = ['categories', 'area', 'ingredients'];
        if (!data)
            notifyHelper("error", { value: "Bad data to generate searching form" });

        let target = "createFormLayout";
        if (arrOption.includes(data.value) && !JSONListCopy[data.value]) {
            data.target = target;
            getSelectedOption(data);
        }
        else {
            data.json = JSONListCopy[data.value];
            data.target = target;
            notifyHelper(target, data);
        }
    };

    const generateRecipe = function (data) {
        let query = getQuery('idMeal');

        getData(query, data, function (data) {
            let target = "createRecipe";
            data.target = target;
            notifyHelper(target, data);
        });
    };

    const getSelectedOption = (data) => {
        let query = null;
        switch (data.value) {
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

        getData(query, data, function (data) {
            notifyHelper('createFormLayout', data);
        });
    };

    const onFormSubmit = function (data) {
        // value - how search ex by name
        //searchingType = value to search
        try {
            if (!data)
                throw "Bad data to generate searching form";
            data.target = 'generateSearchResult';
            let query = getQuery(data.searchingType);
            getData(query, data, function (data) {
                notifyHelper(data.target, data);
            });
        } catch (error) {
            console.error(error);
        }

    };

    const getQuery = (key) => {
        let queryList = {
            idMeal: 'lookup.php?i=',
            mealName: 'search.php?s=',
            flMealsName: 'search.php?f=',
            categoryMealsName: 'filter.php?c=',
            areaMealsName: 'filter.php?a=',
            ingredientMealsName: 'filter.php?i='
        };

        return queryList[key];
    }

    const getData = async function (query, mainData, callback) {
        if (!sendrequest) return;
        let timeout;
        var key = '1';
        try {
            const response = await fetch('https://www.themealdb.com/api/json/v1/' + key + '/' + query + mainData['value']);
            timeout = setTimeout(() => { return }, 60 * 1000);
            const json = await response.json();

            mainData.json = json;
            JSONListCopy[mainData.value] = json;
            await callback(mainData);
            clearTimeout(timeout);
        }
        catch (error) {
            notifyHelper("error", { value: error });
        };
    }

    return Object.freeze({
        addHelper: addHelper,
        setLayoutByValue: setLayoutByValue,
        onFormSubmit: onFormSubmit,
        generateRecipe: generateRecipe,
    });
})();