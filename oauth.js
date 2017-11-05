/**
 * @file handles the aquisition of OAuth2 tokens.
 * @todo Add functionality to refresh tokens rather than reassign
 * @todo Remove the hardcoded Viima OAuth server
 */

var https = require('https');
require('dotenv').config();

/**
 * @description Gets an OAuth token and returns it to callback
 * @param id The client_id required by OAuth
 * @param {string} secret The secret
 * @param {string} user The username/email
 * @param {string} pass The associated password for user
 * @callback callback The callback function for handling https reponse
 */
exports.getToken = function(id,secret,user,pass,callback){
	if(process.env.DEBUG == 1) console.log('Oauth getToken');
	var postData = 'grant_type=password' +
			'&client_id=' + id +
			'&client_secret=' + secret +
			'&username=' + user +
			'&password=' + pass;

	var options = {
		hostname: 'app.viima.com',
		path: '/oauth2/token/',
		method: 'POST',
		origin: 'Viima-Skynet',
		headers: {
			'Content-Type':'application/x-www-form-urlencoded',
			'Content-Length': postData.length,
		},
	};

	var req = https.request(options, (res) => {
		var str = '';
		res.setEncoding('utf8');
		res.on('data', (chunk) => {
			str += chunk;
		});

		res.on('end', () => {
			var json = JSON.parse(str)
			callback(json);
		});
	});

	req.write(postData);
	req.end();
}
