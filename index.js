const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const path = require('path');
const bodyParser = require('body-parser');
const donate = require('./donate');
const login = require('./login');
const message = require('./message');
const events = require('./events');
const rsvp = require('./rsvp');

const api = new ParseServer({
	databaseURI: `${process.env.DATABASE_URI}` || '',
	cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
	serverURL: `${process.env.SERVER_URL}`,
	appId: `${process.env.APP_ID}`,
	masterKey: `${process.env.MASTER_KEY}`
});

const app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the Parse API on the /parse URL prefix
const mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Transactional HTTP routes
app.use('/completeDonation', donate);
app.use('/completeLogin', login);
app.use('/sendMessage', message);
app.use('/upcomingEvents', events);
app.use('/rsvp/complete', rsvp);

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/contact', function(req, res) {
	res.sendFile(path.join(__dirname, '/public/contact.html'));
});

app.get('/contact/dropMessage', function(req, res) {
	res.sendFile(path.join(__dirname, '/public/message.html'));
});

app.get('/about-us', function(req, res) {
	res.sendFile(path.join(__dirname, '/public/about.html'));
});

app.get('/donate', function(req, res) {
	res.sendFile(path.join(__dirname, '/public/donate.html'));
});

app.get('/login', function(req, res) {
	res.sendFile(path.join(__dirname, '/public/login.html'));
});

app.get('/events', function(req, res) {
	res.sendFile(path.join(__dirname, '/public/events.html'));
});

app.get('/rsvp/:id', (req, res) => {
	res.sendFile(path.join(__dirname, '/public/rsvp.html'));
});

const port = process.env.PORT || 1337;
const httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
	console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
