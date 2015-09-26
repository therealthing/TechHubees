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
var Ingredient = React.createClass({
    getDefaultProps: function(){
      return {
        label: null,
        photo: ''
      }
    },
    render: function(){
      return (<div className="col-md-3 col-sm-6 hero-feature">
                  <div className="thumbnail">
                      <img src={this.props.photo} alt={this.props.label}/>
                      <div className="caption">
                          <h3>{this.props.label}</h3>
                      </div>
                  </div>
              </div>);
    }
});
var Recipe = React.createClass({
    getDefaultProps: function(){
      return {
        photo: ''
      }
    },
    render: function(){
      return (<div className="col-md-3 col-sm-6 hero-feature">
                  <div className="thumbnail">
                      <img src={this.props.photo} alt={this.props.label}/>
                      <div className="caption">
                          <h3>{this.props.label}</h3>
                      </div>
                  </div>
              </div>);
    }
});
var ListingIngredients = React.createClass({
    getDefaultProps: function(){
      return {
        ingredients: [],
        photos: []
      }
    },
    render: function(){
      return (
        <div className="row">
          {this.props.ingredients.filter(function(ingredient) {
            return ingredient !== '';
          }).map(function(ingredient, i){
            var matchingImages = this.props.photos.filter(function(photo) {
              return photo.original === ingredient;
            });
            var currentImage = matchingImages.length > 0 ? matchingImages[0].image : null;
            return <Ingredient key={i} label={ingredient} photo={currentImage} />;
          }, this)}
        </div>
      );
    }
});

var ListingRecipes = React.createClass({
    getDefaultProps: function(){
      return {
        photos: []
      }
    },
    render: function(){
      return (
        <div className="row">
            {this.props.recipes.filter(function(recipe) {
            return recipe.title !== '';
          }).map(function(recipe, i){
            return <Recipe key={i} photo={recipe.image} label={recipe.title}/>;
          }, this)}
        </div>
      );
    }
});

var ListingInstagram = React.createClass({
    getDefaultProps: function(){
      return {

      }
    },
    render: function(){
      console.log(this.props.instagram);
      return (
        <div className="row">
       
        </div>
      );
    }
});

var FoodApp = React.createClass({
        getInitialState: function() {
          console.log('get initial state');
          return {
            ingredients: [],
            photos: [],
            recipes: [],
            instagram: []
          }
        },
        componentWillMount: function(){
          //api calls
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
            Food.getRecipes(userInput)
              .then(function(data){
                console.log(data);
                that.setState({recipes:data});
                Food.getInsta(data[0].title)
                  .then(function(data){
                    that.setState({instagram:data});
                  })
              });  

            ingredientsCount = newCount;  
          }
           
      
        },
        componentWillUnmount: function(){
          window.removeEventListener('keydown', this.handleChange);
        },
        render: function() {
         
          return (
              <section>
                <header className="jumbotron hero-spacer">
                  <h1>Hurry up! Your food is getting cold.</h1>
                  <p>Input your ingredients, see what people have done with them, on Instagram.</p>
          
                    <div className="row formfield" >
                      <div className="col-lg-12 bigwidth">
                       
                        <div className="input-group">
                          <input type="text" ref="inputSearch" className="form-control input-lg" placeholder="Search for..." onChange={this.handleChange}/>
                            <span className="input-group-btn">
                              <a className="btn btn-primary btn-lg btn-success" onClick={this.handleChange}>Fetch food!</a>
                            </span>
                        </div> 
                           
                      </div>
                    </div>    
                  </header>
                  <div className="row text-center">
                      <h3>Your ingredients</h3>
                      <ListingIngredients ingredients={this.state.ingredients} photos={this.state.photos}/>
                      <h3>You can cook</h3>
                      <hr/>
                      <ListingRecipes recipes={this.state.recipes}/>
                      <hr/>
                      <ListingInstagram photos={this.state.instagram}/>
                  </div>
                </section>
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
