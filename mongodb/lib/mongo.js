

var mongodb = require('mongodb'),
    nconf = require('nconf'),
    client, mongo, Mongo;

nconf.use('file', { file: './config.json' });
nconf.load();

mongo = exports;

Mongo = mongo.Mongo = function (options) {
  options = options || {};
  this.host = nconf.get('host') || options.host;
  this.port = nconf.get('port') || options.port;
  this.dbName = nconf.get('dbName') || options.dbName;
  this.username = nconf.get('username') || options.username;
  this.password = nconf.get('password') || options.password;
  this.client = new mongodb.Db(this.dbName, new mongodb.Server(this.host, this.port, {}));
};

Mongo.prototype.connect = function (callback) {
  var self = this;
  this.client.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    self.client.authenticate(
      self.username, 
      self.password, 
      function (err, success) {
        if (err) {
          return callback(err);
        }
        if (success) {
          self.db = db;
          return callback(null);
        }
        else {
          return callback(new Error('Credentials refused.'));
        }
      }
    );
  });
};

Mongo.prototype.createCollection = function (colName, callback) {
  this.db.collection(colName, function (err, collection) {
    if (err) {
      return callback(err);
    }
    return callback(null, collection);
  });
};

Mongo.prototype.insert = function (colName, document, callback) {
  var testDoc = {
    user: 'You',
    type: 'Node Ninja',
    skills: 'Node.js'
  };

  if (typeof callback === 'undefined') {
    if (typeof document === 'function') {
      callback = document;
      document = null;
    }
  }

  this.db.collection(colName, function (err, col) {
    if (err) {
      return callback(err);
    }
    col.save(document || testDoc, { safe: true }, function (docs) {
      return callback(null, docs);
    });
  }); 
};

Mongo.prototype.update = Mongo.prototype.insert;

Mongo.prototype.find = function (colName, query, callback) {
  this.db.collection(colName, function (err, col) {
    if (err) {
      return callback(err);
    }
    col.find(query).toArray(function (err, results) {
      if (err) {
        return callback(err);
      }
      return callback(null, results);
    });
  });
};

Mongo.prototype.getAllDocs = function (colName, callback) {
  this.db.collection(colName, function (err, col) {
    if (err) {
      return callback(err);
    }
    col.find().toArray(function (err, results) {
      if (err) {
        return callback(err);
      }
      return callback(null, results);
    });
  });
};


