var rendererHelper = (function () {
  
  'use strict';
  const update = (task, data) => {
    switch (task) {
      case 'createRecipe': createRecipe(data); break;
      case 'createFormLayout': setFormInput(data); break;
      case 'generateSearchResult': generateSearchResult(data); break;
    }
  };

  const createRecipe = function (data) {
    const meal = data.json.meals[0];
    const recipe = new Recipe(meal);
    const html = recipe.toHtmlFromTemplate("#js--mealRecipeTempl","#js--ingredientsListTempl");
    let tag = document.querySelector(".js--mealRecipe");
    if (tag.children.length)
      tag.replaceChild(html, tag.children[0])
    else
      tag.appendChild(html);
  }

  const generateSearchResult = (data) => {
    let $resultDiv = document.querySelector('.js--searchResult');
    var mealsGrid = '';
    if (!(data.json.meals)) mealsGrid = "<span class=\"outline-text exception-text\">Meals not found</span>";
    else {
      data.json.meals.forEach((element, index) => {
        mealsGrid += `<a class="" target="_blank" href="${element.idMeal}">`;
        if (element.strMealThumb)
          mealsGrid += `<img src="${element.strMealThumb}" alt="${element.strMeal}" title="${element.strMeal}" />`;
        mealsGrid += `<h5 class="outline-text">${element.strMeal}</h5>`;
        mealsGrid += '  </a>';
      });
    }
    $resultDiv.innerHTML = mealsGrid;
  };

  const setFormInput = (data) => {
    var inputLayout = null;
    var json = (data.json) ? data.json : null;

    const searchResult = new SearchResult(json);
    
    inputLayout = searchResult.generateHtml(data.value);

    data.sForm.setLayout(inputLayout);
    debugger;
    data.sForm.addEvents(".js--searchMeal", ".js--foundOptions");
  }

  return Object.freeze({
    update: update
  });
})();