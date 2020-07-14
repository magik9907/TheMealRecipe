class SearchResult {

  constructor(data) {
    notificationHelper.update(data);
    if (data && data.meals) {
      let arr = [...(data.meals)];
      this.options = arr.reduce((prev, next) => {
        for (let x in next) {
          if (prev.hasOwnProperty(x)) {
            prev[x].push(next[x]);
          } else {
            prev[x] = [];
            prev[x].push(next[x]);
          }
        }
        return prev;
      }, {});
    }
    else
      this.options = null;
  }
  generateInputText(name,id, placeholder = null) {
    return `<label for="${id}" class="searchBy-text outline-text">Search by: ${name}</label>
    <input type="text" class="js--searchMeal" id="${id}" placeholder="${(placeholder) ? placeholder : ``}" name="${id}"/>`;
  }
  generateOptions(name) {
    let df;
    let optionsArr = this.options[Object.keys(this.options)[0]];
    const createRadio = (type, value, addClass, addTextDesc) => {
      return `<div class="input-row flex btn btn-normal display-none js--searchMealOption ${addClass}">
            <label for="${type + value}">${(value) ? value : addTextDesc}</label>
            <input type="radio" value="${value}"  id="${type + value}"  name="${type}"/></div>`;
    };
    df = `<div class="js--select-bar-option select-bar select-bar-options js--select-bar "> 
    <span class=\"btn btn-normal arrow js--opener-select-bar\" onclick=\"openerArrow(this)\"><i class=\"fas fa-angle-down arrow-symbol\"></i></span>
    <div class="display-flex column js--foundOptions">`;
    df += createRadio(name, "", "js--emptyOption", "Option not found");
    df += optionsArr.reduce((retValue, x) => {
      return retValue + createRadio(name, x);
    }, "");
    df += "</div></div>";
    return df;
  }
  generateHtml(type) {
    let df = null;
    if (this.options) {
      switch (type) {
        case 'categories':
          df = this.generateInputText("categorie","categorieMealsName", "ex: breakfast");
          df += this.generateOptions("categorieMealsName");
          break;
        case 'area':
          df = this.generateInputText("area", "areaMealsName", "ex: Mexic");
          df += this.generateOptions("areaMealsName");
          break;
        case 'ingredients':
          df = this.generateInputText("ingredient","ingredientMealsName", "ex: chicken");
          df += this.generateOptions("ingredientMealsName");
          break;
        default:
          df = "<span class=\"outline-text exception-text\">Bad type searching choosen</span>";
      }
      return df;
    }
    switch (type) {
      case "name":
        df = this.generateInputText("meal name","mealName", "ex: Arrabiata")
        break;
      case 'letter':
        df = this.generateInputText("first letter","flMealsName", "ex: a");
        break;
      default:
        df = "<span class=\"outline-text exception-text\">Bad type searching choosen</span>";
    }
    return df;
  }
}