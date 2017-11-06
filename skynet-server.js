/**
 * @file handles the input direcly from slack bot slash commands, acts as the HTTP server.
 * Imaginatively named Skynet, get it? no? https://en.wikipedia.org/wiki/Skynet_(Terminator)
 */

const express = require('express');
const bodyParser = require('body-parser');
const oauth = require('./oauth');
const viima = require('./viima');
const slack = require('./slack');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const server = app.listen(3000, () => {
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
		viima.query_status(bearerToken, req.body.text);
	});

	/**
	 * @description Posts notification/updates which are detected from Viima
	 */
	var itemCount = 0;
	function updateItems(json){
		// Make sure there is a result. 
		if(json != null){
			// If this isn't here, the function will post like 20 updates on first run
			if(itemCount == 0)
				itemCount = json.length;

			//  Each time this function runs it maintains the state of the Viima item count.
			//
			if(json.length > itemCount) {
				// Set parent text for the update message
				let msg = {
					"text":"Things are happening over at Viima! Here are the latest updates",
					"attachments":[{}]
				}

				// Assuming here that the Viima API returns sorted by date, at 0 is the latest item added.
				// Loop through those, to a maximum of 3 or the different between current count, and that returned.
				for(let i = 0, dif = (json.length - itemCount); i < dif && i < 3; i++){
					let item = {
						"title":json[i].name,
						"title_link":"https://app.viima.com/ashleyksmith/innovaatioiden-hallinta/?categories="
							+ json[i].category + "&statuses=" + json[i].status,
						"text":json[i].description
					};
					msg.attachments.push(item);
				}
				// Use the simple message function. 
				slack.post_simple(msg);
			}
			// Update item count.
			itemCount = json.length;
		}
	}

	// Sets updateItems on a timer. make sure that the authtoken has already been
	// assigned so bad things don't happen
	setInterval(function (){
		if(bearerToken != null)
			viima.getItems(bearerToken, updateItems);
	}, 10000);


});


