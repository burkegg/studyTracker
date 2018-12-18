var config = require('../config/config');

let noop = function(){};

let consoleLog = config.logging ? console.log.bind(console) : noop;

let logger = {
  log: function() {
    let args = _.toArray(arguments)
      .map(function(arg) {
        if(typeof arg === 'object') {
          let string = JSON.stringify(arg, 2);
          return string.magenta;
        } else {
          arg+= '';
          return arg.magenta
        }
      });
      consoleLog.apply(console, args);
  }
};