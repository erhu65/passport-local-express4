var https = require("https"),
    httpProxy = require('http-proxy'),
    fs = require('fs');


var servers = JSON.parse(fs.readFileSync('server_list.json')).servers;

// 1. Create the proxy server.
var proxy = httpProxy.createProxyServer({});


//var server = http.createServer(app);
var credentials = {
    key: fs.readFileSync('./ssl/server.key'),
    cert: fs.readFileSync('./ssl/server.crt')
};

// 2. Create a regular HTTP server.
var s = https.createServer(credentials, function (req, res) {
    var target = servers.shift();     // 3. Remove first server
    // 4. Re-route to that server
    proxy.web(req, res, { target: target });
    servers.push(target);             // 5. Add back to end of list
});

s.listen(8080);

