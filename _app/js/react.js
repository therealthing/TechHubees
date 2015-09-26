var eventQueue = {};
var ingredientsCount = 0;
var photos = {};

/*dispatcher*/
var EventSystem = (function() {
  return {
    publish: function (event, data) {
      var queue = eventQueue[event];
      if (typeof queue === 'undefined') {
        return false;
      }

      for(var i = 0; i < queue.length; ++i)
        queue[i](data);
      return true;
    },
    subscribe: function(event, callback) {
      if (typeof eventQueue[event] === 'undefined') {
        eventQueue[event] = [];
      }

      eventQueue[event].push(callback);
    }
  };
}());
var Ingredient = React.createClass({displayName: "Ingredient",
    getDefaultProps: function(){
      return {
        label: null,
        photo: ''
      }
    },
    render: function(){
      return (React.createElement("div", {className: "col-md-3 col-sm-6 hero-feature"}, 
                  React.createElement("div", {className: "thumbnail"}, 
                      React.createElement("img", {src: this.props.photo, alt: this.props.label}), 
                      React.createElement("div", {className: "caption"}, 
                          React.createElement("h3", null, this.props.label)
                      )
                  )
              ));
    }
});
var ListingIngredients = React.createClass({displayName: "ListingIngredients",
    getDefaultProps: function(){
      return {
        ingredients: [],
        photos: []
      }
    },
    render: function(){
      return (
        React.createElement("div", {className: "row"}, 
          this.props.ingredients.filter(function(ingredient) {
            return ingredient !== '';
          }).map(function(ingredient, i){
            var matchingImages = this.props.photos.filter(function(photo) {
              return photo.original === ingredient;
            });
            var currentImage = matchingImages.length > 0 ? matchingImages[0].image : null;
            return React.createElement(Ingredient, {key: i, label: ingredient, photo: currentImage});
          }, this)
        )
      );
    }
});

var FoodApp = React.createClass({displayName: "FoodApp",
        getInitialState: function() {
          console.log('get initial state');
          return {
            ingredients: [],
            photos: []
          }
        },
        componentWillMount: function(){
          //api calls
          console.log('comp will mount');
          window.addEventListener('keydown', this.handleChange);

          this.handleChange = _.debounce(this.handleChange, 1000);
        },
        handleChange: function(e){
          var userInput = this.refs.inputSearch.getDOMNode().value.trim();
          this.setState({
            ingredients: userInput.split(',').map(_.trim)
          });
          var newCount = userInput.length;
          if(ingredientsCount!= newCount){
            var that = this;
            Food.getIngredients(userInput.split(','))
              .then(function(data){
                that.setState({photos:data});
            });  

            ingredientsCount = newCount;  
          }
           
      
        },
        componentWillUnmount: function(){
          window.removeEventListener('keydown', this.handleChange);
        },
        render: function() {
         
          return (
              React.createElement("section", null, 
                React.createElement("header", {className: "jumbotron hero-spacer"}, 
                  React.createElement("h1", null, "Hurry up! Your food is getting cold."), 
                  React.createElement("p", null, "Input your ingredients, see what people have done with them, on Instagram."), 
          
                    React.createElement("div", {className: "row formfield"}, 
                      React.createElement("div", {className: "col-lg-12 bigwidth"}, 
                       
                        React.createElement("div", {className: "input-group"}, 
                          React.createElement("input", {type: "text", ref: "inputSearch", className: "form-control input-lg", placeholder: "Search for...", onChange: this.handleChange}), 
                            React.createElement("span", {className: "input-group-btn"}, 
                              React.createElement("a", {className: "btn btn-primary btn-lg btn-success", onClick: this.handleChange}, "Fetch food!")
                            )
                        )
                           
                      )
                    )
                  ), 
                  React.createElement("div", {className: "row text-center"}, 
                      React.createElement(ListingIngredients, {ingredients: this.state.ingredients, photos: this.state.photos})
                  )
                )
            );
        }
});

var FoodAppFactory = React.createFactory(FoodApp);

$( document ).ready(function() {
 
    React.render(
      FoodAppFactory({}),
      document.getElementById('foodAppContainer')
    );
});
