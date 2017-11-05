/**
 * @file handles the input direcly from slack bot slash commands, acts as the HTTP server.
 * Imaginatively named Skynet, get it? no? https://en.wikipedia.org/wiki/Skynet_(Terminator)
 */

const express = require('express');
const bodyParser = require('body-parser');
const oauth = require('./oauth');
const viima = require('./viima');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const server = app.listen(3000, () =>{
	var bearerToken = null;
	function setToken(res){
		bearerToken = res.access_token;
		if(process.env.DEBUG == 1) console.log("Token: " + bearerToken);
	}

	// Authenticate skynet to Viima OAuth servers
	oauth.getToken(process.env.VIIMA_CLIENT_ID, process.env.VIIMA_SECRET, process.env.SKYNET_USERNAME, process.env.SKYNET_PASSWORD, setToken);

	console.log('-- Skynet Online --');

	// Handles the http request from slack for the slash command /motd
	app.post('/motd', (req, res) =>{
		if(process.env.DEBUG == 1) console.log('skynet, motd');
		viima.motd(bearerToken);
	});

	// Handles the http request from slack for the slash command /viima
	app.post('/viima', (req, res) => {
		if(process.env.DEBUG == 1) console.log(req.body.text);
		viima.activities(bearerToken, req.body.text);
	});
});


