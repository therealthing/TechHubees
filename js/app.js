var FoodApp = {};
/*our minimal event system*/
FoodApp.eventQueue = {};
FoodApp.EventSystem = (function() {
  return {
    publish: function (event, data) {
      var queue = FoodApp.eventQueue[event];
      if (typeof queue === 'undefined') {
        return false;
      }

      for(var i = 0; i < queue.length; ++i)
      	queue[i](data);
      return true;
    },
    subscribe: function(event, callback) {
      if (typeof FoodApp.eventQueue[event] === 'undefined') {
        FoodApp.eventQueue[event] = [];
      }

      FoodApp.eventQueue[event].push(callback);
    }
  };
}());

/**/
FoodApp.main = React.createClass({
        
        getInitialState: function() {
          return {};
        },
        componentWillMount: function(){
          //api calls
          window.addEventListener('keydown', this.handleChange);
        },
        componentDidMount: function(){
          
        },
        componentWillUnmount: function(){
          window.removeEventListener('keydown', this.handleChange);
        },
        render: function() {
          return (
            <div className="reactApp">
            </div>
          );
        }
      });

FoodApp.layout = document.getElementById('myComp');
var g_applicationState = {};
var g_reactInstance = React.render(React.createElement(FoodApp.main,g_applicationState), FoodApp.layout);