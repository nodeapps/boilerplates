

var request = require('request'),
    nconf = require('nconf'),
    user, pass, url, db,
    connectionString;

nconf.use('file', { 'file': './config.json' });
nconf.load();

user = nconf.get('user');
pass = nconf.get('pass');
url = nconf.get('url');
db = nconf.get('db');

if (user && pass) {
  connectionString = 'http://' + user + ':' + pass + '@' + url + '/' + db;
}
else {
  connectionString = 'http://' + url + '/' + db;
}

var hellorequest = exports;

hellorequest.createDB = function (callback) {
  request.put(connectionString, function (err, res, body) {
    if (err) {
      return console.error(err.message);
    }
    body.statusCode = res.statusCode;
    callback(null, body);
  });
}

hellorequest.insertDoc = function (doc, callback) {
  var testDoc;

  if (typeof callback === 'undefined') {
    callback = doc;
    doc = null;
  }
  
  testDoc = {
    id: 'You',
    type: 'Node Ninja',
    skills: 'Node.js'
  };

  request({
    uri: connectionString, 
    method: 'POST',
    json: doc || testDoc
  },
  function (err, res, body) {
    if (err) {
      return console.error(err.message);
    }
    body.statusCode = res.statusCode;
    callback(null, body);
  });
}

hellorequest.getDoc = function (docID, callback) {
  request({
    uri: connectionString + '/' + docID
  },
  function (err, res, body) {
    if (err) {
      return callback(err);
    }
    body.statusCode = res.statusCode;
    callback(null, body);
  });
}

hellorequest.getAllDocs = function (callback) {
  request({
    uri: connectionString + '/' + '_all_docs?include_docs=true'
  },
  function (err, res, body) {
    if (err) {
      return callback(err);
    }
    body.statusCode = res.statusCode;
    callback(null, body);
  });
}
