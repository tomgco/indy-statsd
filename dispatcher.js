var EventEmitter = require('events').EventEmitter;
var async = require('async');
var Lynx = require('lynx');
var util = require('util');

function DefaultDispatcher(options) {
  if (!(this instanceof DefaultDispatcher)) {
    return new DefaultDispatcher(options);
  }
  EventEmitter.call(this);

  this.options = options || {};
  this.options.name = this.options.name || 'indy';
  this.options.env = this.options.env || process.env.NODE_ENV || 'development';

  this.lynxOptions = this.options.lynx || {};
  this.metrics = new Lynx();
}

util.inherits(DefaultDispatcher, EventEmitter);

DefaultDispatcher.prototype.dispatch = function (obj, done) {
  var self = this;
  async.eachLimit(Object.keys(obj), 2, function iterator(fn, cb) {
    setImmediate(DefaultDispatcher.prototype[fn].bind(self, obj[fn]));
    cb();
  }, function cb() {
    // we are done.
    if (done) {
      return done();
    }
  });
};

DefaultDispatcher.prototype.gccount = function (c) {
  this.metrics.gauge('v8.gc.count', c);
};

DefaultDispatcher.prototype.memrss = function (c) {
  this.metrics.gauge('os.mem.rss', c);
};

DefaultDispatcher.prototype.memfree = function (c) {
  this.metrics.gauge('os.mem.free', c);
};

DefaultDispatcher.prototype.memtotal = function (c) {
  this.metrics.gauge('os.mem.total', c);
};

// V8 Heap Total
DefaultDispatcher.prototype.memheaptotal = function (c) {
  this.metrics.gauge('v8.mem.total', c);
};

// V8 Heap Used
DefaultDispatcher.prototype.memheapused = function (c) {
  this.metrics.gauge('v8.mem.used', c);
};

DefaultDispatcher.prototype.cpus = function () {
  // noop for now.
};

DefaultDispatcher.prototype.loadavg5 = function (c) {
  this.metrics.gauge('os.load.5', c);
};

DefaultDispatcher.prototype.loadavg10 = function (c) {
  this.metrics.gauge('os.load.10', c);
};

DefaultDispatcher.prototype.loadavg15 = function (c) {
  this.metrics.gauge('os.load.15', c);
};

DefaultDispatcher.prototype.delay = function (c) {
  this.metrics.gauge('node.loopDelay', c);
};

module.exports = DefaultDispatcher;
