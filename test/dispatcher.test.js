var Dispatcher = require('../');
var fixture = require('./fixture');

describe('Dispatcher', function () {

  it('should run the metrics on each data point feed to it.', function (done) {
    var d = new Dispatcher();
    d.dispatch(fixture(), done);
  });

});
