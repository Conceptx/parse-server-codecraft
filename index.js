var express = require('express');
var ParseServer = require('parse-server').ParseServer;
// var S3Adapter = require('parse-server').S3Adapter;
var path = require('path');
var cors = require('cors');

var databaseUri =
  'mongodb://letthemtrust:lttadmin19@ds159574.mlab.com:59574/ltt';

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  //**** General Settings ****//

  databaseURI: databaseUri,
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  serverURL: process.env.SERVER_URL,
  //**** Security Settings ****//
  // allowClientClassCreation: process.env.CLIENT_CLASS_CREATION || false,
  appId: 'parse-ltt-app-ID',
  masterKey: 'parse-ltt-master-KEY'
});

var app = express();

// Cross-Origin Middlware

app.use(
  cors({
    'access-control-allow-origin': '*',
    origin: 'https://letthemtrust.herokuapp.com'
  })
);

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
  console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
