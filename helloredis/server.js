var util = require('util'),
    nconf = require('nconf'),
    redis = require('redis');

//
// Pull app configuration out from config.json file
//
nconf.file({ file: './config/config.json' });

var port = nconf.get('database:port'),
    host = nconf.get('database:host'),
    pass = nconf.get('database:password');

var client = redis.createClient(port, host);

client.auth(pass, function (err) {
  if (err) {
    throw err;
  }
});

client.on('ready', function () {

  // Set!
  client.set('foo', 'bar', function (err, res) {
    if (err) {
      throw err;
    }

    // Get!
    client.get('foo', function (err, foo) {
      if (err) {
        throw err;
      }

      console.log('foo = %s;', foo);

      client.quit();
    });
  });
});
