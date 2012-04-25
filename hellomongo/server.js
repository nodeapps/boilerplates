var util = require('util'),
    nconf = require('nconf'),
    mongodb = require('mongodb'),
    Db = mongodb.Db,
    Connection = mongodb.Connection,
    Server = mongodb.Server;

//
// Pull app configuration out from config.json file
//
nconf.file({ file: './config/config.json' });

var host = nconf.get('database:host'),
    port = nconf.get('database:port'),
    dbName = nconf.get('database:database'),
    user = nconf.get('database:username'),
    pass = nconf.get('database:password');

var db = new Db(dbName, new Server(host, port, {}));

// Interact with your database!
db.open(function (err, db) {
  if (err) {
    throw err;
  }

  if (user && pass) {
    db.authenticate(user, pass, postAuth);
  }
  else {
    postAuth(null);
  }

  function postAuth(err) {
    if (err) {
      throw err;
    }

    db.collection('foo', function (err, collection) {
      if (err) {
        throw err;
      }

      // set
      collection.insert({ 'foo': 'bar' }, function (err, docs) {
        if (err) {
          throw err;
        }

        // get
        collection.findOne(docs[0]._id, function (err, doc) {
          if (err) {
            throw err;
          }

          console.log(doc);
          console.log('success!');
          db.close();
        });
      });
    });
  }

});
