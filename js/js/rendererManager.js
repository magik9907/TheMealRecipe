var rendererManager = (function () {
  'use strict';
  const update = (task, data) => {
    console.log(data);
    switch (task) {
      case 'createFormLayout': setFormInput(data); break;
      case 'generateSearchResult': generateSearchResult(data); break;
    }
  };

  const generateSearchResult = (data) => {
    let $resultDiv = document.querySelector('.js--searchResult');
    var mealsGrid = '';

    data.json.meals.forEach((element, index) => {
      mealsGrid += `<a class="flex" href="${index+'/'+element.idMeal}">`;
      if(element.strMealThumb)
        mealsGrid+=`<img src="${element.strMealThumb}" />`;
      mealsGrid += `<h5>${element.strMeal}</h5>`;
      mealsGrid+='  </a>';
    });

    $resultDiv.innerHTML = mealsGrid;
  };

  const setFormInput = (data) => {
    var json = (data.json)?data.json:null;
    
    var inputLayout = null;
    switch (data.value) {
      case 'name':
        inputLayout =
          `<label for="mealName">Meal name:</label>
          <input type="text" class="js--searchMeal" id="mealName" placeholder="ex: Arrabiata" name="mealName"/>`;
        break;
      case 'letter':
        inputLayout = "<label for=\"letterList\"></label><select class=\"js--searchMeal\" id=\"letterList\" name=\"flMealsName\">";
        inputLayout += '<option value="">--Select--</option>';
        for (let i = 65; i < 91; i++)
          inputLayout += `<option value="${String.fromCharCode(i).toLowerCase()}">${String.fromCharCode(i)}</option>`;
        inputLayout += "</select > ";

        break;
      case 'categories':
        inputLayout = "<label for=\"categoriesList\"></label><select class=\"js--searchMeal\" id=\"categoriesList\" name=\"categorieMealsName\">";
        inputLayout += '<option value="">--Select--</option>';
        inputLayout += json.meals.reduce((retValue, x, number) => {
          return retValue + `<option value="${x.strCategory}">${x.strCategory}</option>`;
        });
        inputLayout += "</select > ";
        break;
      case 'area':
        inputLayout = "<label for=\"areaList\"></label><select class=\"js--searchMeal\" id=\"areaList\" name=\"areaMealsName\">";
        inputLayout += '<option value="">--Select--</option>';
        inputLayout += json.meals.reduce((retValue, x, number) => {
          return retValue + `<option value="${x.strArea}">${x.strArea}</option>`;
        });
        inputLayout += "</select > ";
        break;
      case 'ingredients':
        inputLayout = `<label for=\"ingredientList\"></label><select class=\"js--searchMeal\" id=\"ingredientList\" name=\"ingredientMealsName\">
            <option value="" >--Select--</option>`;
        inputLayout += json.meals.reduce((retValue, x, number) => {
          return retValue + `<option value="${x.strIngredient}">${x.strIngredient}</option>`;
        });
        inputLayout += `</select > 
            <p class="ingredient-desc"></p>`;
        break;
      default:
        inputLayout = "Bad type searching choosen";
    }
    
    data.selector.innerHTML = inputLayout;
  }

  return {
    update: update
  }
})();