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

var ListingIngredients = React.createClass({
    getDefaultProps: function(){
      return {
        ingredients: []
      }
    },
    render: function(){
      return (
        <div>
          {this.props.ingredients.map(function(ingredint){
            return <div className="col-md-3 col-sm-6 hero-feature">
                <div className="thumbnail">
                    <img src="http://placehold.it/800x500" alt=""/>
                    <div className="caption">
                        <h3>{ingredint}</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                        <p>
                            <a href="#" className="btn btn-primary">Buy Now!</a> <a href="#" className="btn btn-default">More Info</a>
                        </p>
                    </div>
                </div>
            </div>;
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
        },
        componentDidMount: function(){
          console.log('comp did mount');
        },
        handleChange: function(e){
          console.log('text changes');
          this.setState({
            ingredients: this.refs.inputSearch.getDOMNode().value.split(' ')
          });
        },
        componentWillUnmount: function(){
          window.removeEventListener('keydown', this.handleChange);
        },
        render: function() {
          var message =
            'React is running successfully';

          return (
                <div>  
                  <div className="input-group">
                      <input type="text" ref="inputSearch" className="form-control input-lg" placeholder="Search for..." onChange={this.handleChange}/>
                        <span className="input-group-btn">
                          <a className="btn btn-primary btn-lg btn-success" onClick={this.handleChange}>Fetch food!</a>
                        </span>
                  </div>
                  <div className="row text-center">
                    <ListingIngredients ingredients={this.state.ingredients}/>
                  </div>
                </div>  
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
