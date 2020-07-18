

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

        if (arrOption.includes(data.value) && !JSONListCopy[data.value])
            getSelectedOption(data);
        else {
            let target = "createFormLayout";
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
        data.target = 'generateSearchResult';
        try {
            if (!data)
                throw "Bad data to generate searching form";
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
        var key = '1';
        await fetch('https://www.themealdb.com/api/json/v1/' + key + '/' + query + mainData['value'])
            .then((response) => response.json())
            .then((data) => {
                JSONListCopy[mainData.value] = data;
                mainData.json = data;
                callback(mainData);
            })
            .catch((error) => {
                notifyHelper("error", { value: error });
            });
    }

    return Object.freeze({
        addHelper: addHelper,
        setLayoutByValue: setLayoutByValue,
        onFormSubmit: onFormSubmit,
        generateRecipe: generateRecipe,
    });
})();