var domready = require('domready');
var shoe = require('shoe');
var dnode = require('dnode');

domready(function () {
    var result = document.getElementById('result');
    var stream = shoe('/dnode');

    var d = dnode();
    d.on('remote', function (remote) {
        remote.ping(function (s) {
            result.textContent = s;
        });
    });
    d.pipe(stream).pipe(d);
});