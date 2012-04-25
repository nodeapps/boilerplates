var util = require('util'),
    nconf = require('nconf'),
    nano;

//
// Pull app configuration out from config.json file
//
nconf.file({ file: './config/config.json' });

var port = nconf.get('port'),
    host = nconf.get('host');


// Assemble couchdb connect url from options
var auth = [
      nconf.get('database:username'),
      nconf.get('database:password')
    ].join(':'),
    uri = util.format('http://%s%s:%s',
      (auth == ':') ? '' : auth + '@',
      nconf.get('database:host') || 'localhost',
      nconf.get('database:port') || 5984
    ),
    dbName = nconf.get('database:database') || 'hellocouch';

// Use nano
nano = require('nano')(uri);

nano.db.create(dbName, function (err) {
  if (err) {
    // Usually the error is that the file already exists.
    if (err.message.match('already exists')) {
      console.log('Database exists.');
    }
    else {
      throw err;
    }
  }

  var db = nano.db.use(dbName);

  // Get!
  db.get('hello', function (err, doc) {

    if (err) {
      throw err;
    }

    console.log(doc);

    // Set!
    db.insert({ hello: 'world' , _rev: doc._rev}, 'hello', function (err, res) {
      if (err) {
        throw err;
      }

      console.log(res);
    });
  });
});
