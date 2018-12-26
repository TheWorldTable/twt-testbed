// Dependencies
const express = require('express');

const fs = require('fs'),
    path = require('path'),
    program = require('commander'),
    https = require('https'),
    options = {
      key: fs.readFileSync(path.resolve(__dirname, 'ssl/star.worldtable.co.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'ssl/star.worldtable.co.crt')),
      ca: [
        fs.readFileSync(path.resolve(__dirname, 'ssl/ca1.crt')),
        fs.readFileSync(path.resolve(__dirname, 'ssl/ca2.crt'))
      ]
    };

program
    .version('1.0')
    .option('-p, --port <n>', 'https port', '443')
    .option('-P, --insecure-port <n>', 'https port', '80')
    .parse(process.argv);

// Configure & Run the http server
const app = express(),
    port = parseInt(program.port),
    insecurePort = parseInt(program.insecurePort);

app.use(function (req, res, next) {
  if (req.secure) {
    next();
  } else {
    // request was via http, so redirect to https
    res.redirect('https://' + req.headers.host + (port === 443 ? '' : `:${port}`) + req.url);
  }
});

console.log(`Listening for secure connections on ${port}`);
console.log(`Listening for insecure connections on ${insecurePort}`);

app.use(express.static(__dirname, { dotfiles: 'allow' } ));

https.createServer(options, app).listen(port);

app.listen(insecurePort);