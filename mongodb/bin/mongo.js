

var Mongo = require('../lib/mongo').Mongo,
    client = new Mongo();

client.connect(function (err) {
  if (err) {
    return console.error(err.stack);
  }
  client.createCollection('test', function (err, coll) {
    if (err) {
      return console.error(err.stack);
    }
    client.insert('test', afterInsert);
  });
});

function afterInsert(err, docs) {
  if (err) {
    return console.error(err.stack);
  }
  client.find('test', {user: 'You'}, afterFind);
}

function afterFind(err, results) { 
  if (err) {
    return console.error(err.stack);
  }
  console.log('Documents returned from query: %j', results);
  client.insert('test', {
    user: 'user2',
    type: 'admin',
    flag: 'awesome'
  }, function (err, docs) {
    if (err) {
      return console.error(err.stack);
    }
    allDocs();
  });
}

function allDocs() {
  client.getAllDocs('test', function (err, results) {
    if (err) {
      return console.error(err.stack);
    }
    console.log('All Documents: \n%j', results);
    client.db.close();
  });
}


