var hello = require('../lib/couchdb');

hello.insertDoc({
  id: 'user3',
  type: 'regular person',
  skills: 'hamburgers'
},
function (err, body) {
  if (err) {
    return console.error(err.message);
  }
  console.dir(body);
  hello.getAllDocs(function (err, body) {
    if (err) {
      return console.error(err.message);
    }
    console.dir(body);
  });
});

