var  http = require('http');
     shoe = require('shoe'),
     path = require('path'),
 ecstatic = require('ecstatic')(path.join(__dirname, path.join('..', 'static'))),
    dnode = require('dnode');

var server = http.createServer(ecstatic);
server.listen(8080);

var sock = shoe(function (stream) {
    var d = dnode({
        ping : function (cb) {
            cb('dnode');
        }
    });
    d.pipe(stream).pipe(d);
});
sock.install(server, '/dnode');