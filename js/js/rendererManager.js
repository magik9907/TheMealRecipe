var rendererManager = (function () {
  'use strict';
  const update = (task, data) => {
    switch (task) {
      case 'createRecipe': createRecipe(data); break;
      case 'createFormLayout': setFormInput(data); break;
      case 'generateSearchResult': generateSearchResult(data); break;
    }
  };

  const createRecipe = function (data) {
    var templBody = document.querySelector("#js--mealRecipeTempl").content.cloneNode(true);
    var templList = document.querySelector("#js--ingredientsListTempl").content;
    const meal = data.json.meals[0];
    var htmlList = null;
    var dfElement, dfList = new DocumentFragment();
    var regexIngredient = /strIngredient\d+/;
    let tag;
    for (let x in meal) {

      if (meal[x]) {
        if (regexIngredient.test(x)) {
          dfElement = templList.cloneNode(true);
          dfElement.querySelector("[data-" + x.replace(/\d+/, "") + "]").textContent = meal[x];
          x = x.replace("Ingredient", "Measure");
          dfElement.querySelector("[data-" + x.replace(/\d+/, "") + "]").textContent = meal[x];

          dfList.appendChild(dfElement);
        } else if (tag = templBody.querySelector("[data-" + x.replace(/\d+/, "") + "]")) {
          switch (x) {
            case 'idMeal':
              tag.setAttribute("data-" + x, meal[x]);
              break;
            case 'strMealThumb':
              tag.setAttribute("src", meal[x]);
              break;
            case 'strSource':
              tag.setAttribute("href", meal[x]);
              break;
            case "strYoutube":
              // TODO: create youtube video load system
              tag.setAttribute("src", meal[x])
              break;
            default: tag.textContent = meal[x];
          }
        }
      } else if (tag = templBody.querySelector("[data-" + x + "]")) {
        tag.remove();
      }
    };

    templBody.querySelector("[data-ingredientsList]").appendChild(dfList);
    tag = document.querySelector(".js--mealRecipe");
    if (tag.children.length)
      tag.replaceChild(templBody, tag.children[0])
    else
      tag.appendChild(templBody);
  }
  const generateSearchResult = (data) => {
    let $resultDiv = document.querySelector('.js--searchResult');
    var mealsGrid = '';
    if (!(data.json.meals)) mealsGrid = "<p>Meals not found</p>";
    else {
      data.json.meals.forEach((element, index) => {
        mealsGrid += `<a class="" target="_blank" href="${element.idMeal}">`;
        if (element.strMealThumb)
          mealsGrid += `<img src="${element.strMealThumb}" />`;
        mealsGrid += `<h5 class="outline-text">${element.strMeal}</h5>`;
        mealsGrid += '  </a>';
      });
    }
    $resultDiv.innerHTML = mealsGrid;
  };

  const createRadio = (type, value) => {
    return `<div class="input-row flex btn btn-normal display-none js--searchMealOption">
          <label for="${type + value}">${value}</label>
          <input type="radio" value="${value}"  id="${type + value}"  name="${type}"/></div>`;
  };

  const setFormInput = (data) => {
    var inputLayout = null;
    var json = (data.json) ? data.json : null;

    switch (data.value) {
      case 'name':
        inputLayout =
          `<label for="mealName">Meal name:</label>
          <input type="text" class="js--searchMeal" id="mealName" placeholder="ex: Arrabiata" name="mealName"/>`;
        break;
      case 'letter':
        inputLayout = `<label for="firstLName">First letter:</label>
        <input type="text" class="js--searchMeal"" id="firstLName" placeholder="ex: a" name="flMealsName"/>`
        break;
      case 'categories':
        inputLayout =
          `<label for="categorieName">Categorie name:</label>
          <input type="text" class="js--searchMeal" id="categorieName" placeholder="ex: breakfast" name="categorieMealsName"/>
          <div class="js--select-bar-option js--select-bar open"> 
          <div class="display-flex column js--foundOptions">`;
        inputLayout += json.meals.reduce((retValue = "", x, number) => {
          return (typeof (retValue) == "object") ? createRadio("categorieMealsName", retValue.strCategory) + createRadio("categorieMealsName", x.strCategory) : retValue + createRadio("categorieMealsName", x.strCategory);
        });
        inputLayout += "</div></div>";
        break;

      case 'area':
        inputLayout =
          `<label for="areaName">Area name:</label>
          <input type="text" class="js--searchMeal" id="areaName" placeholder="ex: Mexic" name="areaMealsName"/>
          <div class="js--select-bar-option js--select-bar open"> 
          <div class="display-flex column js--foundOptions">`;
        inputLayout += json.meals.reduce((retValue = "", x, number) => {
          return (typeof (retValue) == "object") ? createRadio("areaMealsName", retValue.strArea) + createRadio("ingredientMealsName", x.strIngredient) : retValue + createRadio("areaMealsName", x.strArea);
        });
        inputLayout += "</div></div>";
        break;
      case 'ingredients':
        inputLayout =
          `<label for="ingredientName">Ingredient name:</label>
          <input type="text" class="js--searchMeal" id="ingredientName" placeholder="ex: Chicken" name="ingredientMealsName"/>
          <div class="js--select-bar-option js--select-bar open">
          <div class="display-flex column js--foundOptions">`;
        inputLayout += json.meals.reduce((retValue = "", x, number) => {
          return (typeof (retValue) == "object") ? createRadio("ingredientMealsName", retValue.strIngredient) + createRadio("ingredientMealsName", x.strIngredient) : retValue + createRadio("ingredientMealsName", x.strIngredient);
        });
        inputLayout += "</div></div>";
        break;
      default:
        inputLayout = "Bad type searching choosen";
    }

    data.Form.setLayout(inputLayout);
    data.sForm.addEvents(".js--searchMeal", ".js--foundOptions");

    // mealSearchingForm.addEvents(".js--searchMeal", ".js--foundOptions");
  }

  return {
    update: update
  }
})();