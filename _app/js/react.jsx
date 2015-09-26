var eventQueue = {};

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
    getInitialState: function(){
      return {
        photo: ''
      }
    },
    getDefaultProps: function(){
      return {
        label: null
      }
    },
    componentDidMount: function(){
      this.updatePhoto();
    },
    componentDidUpdate: function(){
      this.updatePhoto();
    },
    render: function(){
      return (<div className="col-md-3 col-sm-6 hero-feature">
                  <div className="thumbnail">
                      <img src={this.state.photo} alt={this.props.label}/>
                      <div className="caption">
                          <h3>{this.props.label}</h3>
                      </div>
                  </div>
              </div>);
    },
    updatePhoto: function() {
     ;
    }
});
var ListingIngredients = React.createClass({
    getDefaultProps: function(){
      return {
        ingredients: []
      }
    },
    render: function(){
      return (
        <div className="row">
          {this.props.ingredients.filter(function(ingredient) {
            return ingredient !== '';
          }).map(function(ingredient, i){
            return <Ingredient key={i} label={ingredient} />;
          }
          )}
        </div>
      );
    }
});

var FoodApp = React.createClass({
        getInitialState: function() {
          console.log('get initial state');
          return {
            ingredients: []
          }
        },
        componentWillMount: function(){
          //api calls
          console.log('comp will mount');
          window.addEventListener('keydown', this.handleChange);

          this.handleChange = _.debounce(this.handleChange, 500);
        },
        componentDidMount: function(){
          console.log('comp did mount');
        },
        handleChange: function(e){
          var userInput = this.refs.inputSearch.getDOMNode().value.trim();
          this.setState({
            ingredients: userInput.split(',')
          });
        
          Food.getIngredients(userInput.split(','))
            .then(function(data){
               console.log(data); 
          }); 
      
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
                      <ListingIngredients ingredients={this.state.ingredients}/>
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
