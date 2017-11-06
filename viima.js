/**
 * @file handles the Viima side of the bot. It requests various information through the Viima API which is provided by the functions in this source file.
 * @todo motd was originally intended as a Slack channel join, sign in message. Requires the Slack event API to be fully implemented.
 * @todo Security considerations. Right now the bot will respond to any request regardless if the calling user has access to the items.
 */

var http = require('https');
require('dotenv').config();
var slack = require('./slack');
var request = require('request');

module.exports = {
	/**
	 * @description Requests which is what is basically a login notification / or motd from the Viima installation.
	 * @param {string} token The OAuth token provided by Viima OAuth servers.
	 * @returns Nothing.
	 */
	motd: function(token) {
		if(process.env.DEBUG == 1) console.log('viima, get_info');
		const options = {
			hostname: process.env.VIIMA_HOST,
			path: process.env.VIIMA_BOARD,
			method: 'GET',
			headers: {
				'Content-Type':'application/json',
				'Authorization':'Bearer ' + token,
			}
		};

		const request = http.request(options, (res) => {
			var str = '';
			res.setEncoding('utf-8');
			res.on('data', (chunk) => {
				str += chunk;
		  	});
		  	res.on('end', () => {
				var json = JSON.parse(str);
				slack.post_motd(json);
		  	});
		});

		request.on('error', (e) => {
			console.error('Problem with request: ' + e.message);
		});

		request.end();
	},

	getItems: function(token, callback){
		if(process.env.DEBUG == 1) console.log('viima.js, getItems');
		const options = {
			hostname: process.env.VIIMA_HOST,
			path: process.env.VIIMA_BOARD + 'items/',
			method: 'GET',
			headers: {
				'Content-Type':'application/json',
				'Authorization':'Bearer ' + token,
			}
		};

		const request = http.request(options, function (res) {
			var str = '';
			res.setEncoding('utf8');

			res.on('data', function (chunk){
				str += chunk;
			});

			res.on('end', function () {
				var json = JSON.parse(str);
				callback(json);
			})
		});

		request.on('error', function(error){
			console.error('Problem with request: ', error.message);
		});

		request.end();
	},

	/**
	 * @description I'm not sure what to call this function yet. It basically takes input from Slack,
	 * 		and responds with a list of items from Viima based on the input from the user. For
	 * 		example /viima customer_support in_progress will return all items in customer support category, and with a
	 *              in_progress status.
	 * @param {string} token The OAuth of an authenticated user with Viima OAuth servers
	 * @param {string} params The user input from slack. Must be in the form /viima <category> <status>
	 * @returns Nothing.
	 */
	query_status: function(token, params) {
		if(process.env.DEBUG == 1) console.log('viima.js, activities');
		const options = {
			hostname: process.env.VIIMA_HOST,
			path: process.env.VIIMA_BOARD + 'items/',
			method: 'GET',
			headers: {
				'Content-Type':'application/json',
				'Authorization':'Bearer ' + token,
			}
		};

		const request = http.request(options, (res) => {
			var str = '';
			res.setEncoding('utf-8');
			res.on('data', (chunk) =>{
				str += chunk;
			});

			res.on('end', () => {
				let json = JSON.parse(str);
				let parsedJson = [];
				if(params != ""){
					var split_params = params.split(" ");
					var category_lookup = {
						'customer_service':9726,
						'other':9729,
						'new_business':9728,
						'exmployee_satisfaction':9727,
						'process_enhancements':9725,
						'incremental_improvement':9724,
					};
					var status_lookup = {
						'new':8977,
						'together':8978,
						'implemented':8979,
						'in_progress':8980,
						'done':8981,
						'maybe_later':8982
					};
					for(let i = 0; i < json.length; i++){
						if(json[i].status == status_lookup[split_params[1]]){
							parsedJson.push(json[i]);
						}
					}
				} else {

				}
				slack.post_status_query(parsedJson, params);
			});
		});

		request.on('error', (e) => {
			console.error('Problem with request: ' + e.message);
		});
		request.end();
	}
}
