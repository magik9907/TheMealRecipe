const urlHelper = (function () {
    const update = (task, data) => {
        if (!data.hasOwnProperty("notPushHistory"))
            switch (task) {
                case 'createRecipe': recipe(data); break;
                case 'createFormLayout': form(data); break;
                case 'generateSearchResult': search(data); break;
            }

    };

    const createPush = (type, data) => {
        const url = setUrl(type, data);
        const state = setState(type, data);
        pushState(state, url);
    }

    const recipe = (data) => {
        createPush("r=", data);
    };

    form = (data) => {
        createPush("f=", data);
    };

    search = (data) => {
        createPush("s=", data);
    };

    const pushState = (state, url) => {
        console.log("PUSH",state);
        
        history.pushState(state, document.title, (url) ? "?" + url : "");
    }

    const setState = (type, data) => {
        let state = {
            type: type,
            searchingType: data.searchingType,
            target: data.target,
            value: data.value,
        };
        return state;
    }

    const setUrl = (type, data) => {
        let queryType = type.replace("=", "");
        const regex = new RegExp(type);
        let url = location.search.replace("?", "");
        if (regex.test(url)) {
            let urlArr = url.split("&");
            let urlArrToType = urlArr.flatMap((x) => {
                return [x.split("=")];
            });
            urlArrToType = urlArrToType.filter(x => {
                if (x[1] == "" || x[1] == undefined) {
                    return false;
                }
                if (x[0] === queryType) {
                    if (!data.value) return false;
                    x[1] = data.value
                }
                return true;
            });
            return urlArrToType.reduce((prev, next) => {
                return prev + next[0] + "=" + next[1] + "&";
            }, "");
        }
        let urlArr = url.split("&");
        let urlArrToType = urlArr.flatMap((x) => {
            return [x.split("=")];
        });
        urlArrToType = urlArrToType.filter(x => {
            return Boolean(x[1] != "" && x[1] != undefined);
        });

        return urlArrToType.reduce((prev, next) => {
            return prev + next[0] + "=" + next[1] + "&";
        }, "").concat((data.value) ? type + data.value : "");
    }

    return Object.freeze({
        update: update,
    });
})();