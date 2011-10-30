/*
 * johndriscoll.name
 * Copyright 2011 John Driscoll
 */

// Dependencies
var sys = require('sys'),
http = require('http'),
path = require('path'),
paperboy = require('paperboy'),

// Server settings
webroot = path.join(path.dirname(__filename), '../public'),
port = 8080;

http.createServer(
  function(req, res) {
    var ip = req.connection.remoteAddress;
    paperboy
      .deliver(webroot, req, res)
      .addHeader('Expires', 300)
      .addHeader('X-PaperRoute', 'Node')
      .before(function() {
                console.log('Received Request');
              })
      .after(function(statCode) {
               log(statCode, req.url, ip);
             })
      .error(function(statCode, msg) {
               res.writeHead(statCode, {'Content-Type': 'text/plain'});
               res.end("Error " + statCode);
               log(statCode, req.url, ip, msg);
             })
      .otherwise(function(err) {
                   res.writeHead(404, {'Content-Type': 'text/plain'});
                   res.end("Error 404: File not found");
                   log(404, req.url, ip, err);
                 });
  }).listen(port);

function log(statCode, url, ip, err) {
  var logStr = statCode + ' - ' + url + ' - ' + ip;
  if (err)
    logStr += ' - ' + err;
  console.log(logStr);
}