//food nutrition
var Food = {};

Food.getRecipes = function(ingredients) {
    var deferred = $.Deferred();
    $.ajax({
        url: "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients",
        type: "GET",
        data: {
            ingredients: ingredients
        },
        headers: {
            "X-Mashape-Key": "jis02SUQJVmsh25L1vfXvYhJAvxyp1AaDFAjsndi1cy5fhnK8H"
        }
    }).then(function(data) {
        
        Food.getInsta(data[0].title);
        deferred.resolve(data);
    });
    return deferred.promise();
}
Food.getRecipes("milk, eggs");

Food.getInsta = function(tag) {
    tag = tag.replace(" ", "");
    var deferred = $.Deferred();
    $.ajax({
        url: "https://api.instagram.com/v1/tags/" + tag + "/media/recent",
        dataType: "jsonp",
        data: {
            client_id: "e09cbeff335c4b4aa27071d684d0b840"
        },
        type: "GET",
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    }).then(function(data) {

        var imgArray = [];
        for (var i = 0; i < data.data.length; i++) {
            imgArray.push(data.data[i].images.standard_resolution.url);
        }
        
        deferred.resolve(imgArray);
    });
    return deferred.promise();
}
