class Recipe {
    constructor(data) {
        this.recipe = new Object();
        let newProp;
        let regex = /\d+/g;
        let measureRegex = /strMeasure\d+/;
        let ingredient;
        for (let prop in data) {
            if(measureRegex.test(prop)) continue;
            if (data[prop] ) {
                switch (regex.test(prop)) {
                    case true:
                        ingredient = {};
                        newProp = prop.replace(regex, "");
                        ingredient[newProp] = data[prop];
                        newProp = prop.replace(/Ingredient/gi, "Measure");
                        ingredient[newProp.replace(regex, "")] = data[prop];
                        this.addToArray(prop.replace(regex, ""), ingredient);
                        ingredient = null;
                        newProp = null;
                        break;
                    case false:
                        this.addToKey(prop, data[prop]);
                        break;
                }
            }
        }
    }
    addToArray(prop, elem) {
        if (!(this.recipe.hasOwnProperty(prop))) {
            this.recipe[prop] = [];
        }
        this.recipe[prop].push(elem);
    }
    addToKey(prop, elem) {
        this.recipe[prop] = elem;
    }
    generateIngredientList(selector, key) {
        let ingredients = [...this.recipe[key]];
        let templList = document.querySelector(selector).content;
        let dfElement
        let dfElements = ingredients.map(x => {
            dfElement = templList.cloneNode(true);
            dfElement.querySelector("[data-strIngredient]").textContent = x.strIngredient;
            dfElement.querySelector("[data-strMeasure]").textContent = x.strMeasure;
            return dfElement;
        });
        return dfElements.reduce((x, y) => (x.appendChild(y)), new DocumentFragment());
    }
    toHtmlFromTemplate(selectorRecipe, selectorIngredients) {
        const templBody = document.querySelector(selectorRecipe).content.cloneNode(true);
        const regex = /ingredient/gi;
        let tag;
        for (let x in this.recipe) {

            if (regex.test(x)) {
                templBody.querySelector("[data-ingredientsList]").appendChild(this.generateIngredientList(selectorIngredients, x));
            } else if (tag = templBody.querySelector("[data-" + x + "]")) {
                switch (x) {
                    case 'strMeal':
                        tag.textContent = this.recipe[x];
                        tag = templBody.querySelector("img")
                        
                        tag.setAttribute("title" , this.recipe[x]);
                        tag.setAttribute("alt" , this.recipe[x]);
                        break;
                    case 'idMeal':
                        tag.setAttribute("data-" + x, this.recipe[x]);
                        break;
                    case 'strMealThumb':
                        tag.setAttribute("src", this.recipe[x]);
                        break;
                    case 'strSource':
                        tag.setAttribute("href", this.recipe[x]);
                        break;
                    case "strYoutube":
                        // TODO: create youtube video load system
                        tag.setAttribute("src", this.recipe[x]);
                        break;
                    default: tag.textContent = this.recipe[x];
                }
            } else {
                tag = templBody.querySelector("[data-" + x + "]");
                tag.remove();
            }
        }
        return templBody;
    }

}