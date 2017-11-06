/**
 * @file handles the slack chat webhooks to post formatted messages to slack channels.
 * @todo move the path/tokens to env.
 * @todo I'm sure the bot is capable of instructing which channel to post to in the request. Right now it just posts to development channel! oops
 * @todo It might be possible to have just a single function here, which would help the modularity and code reuse part of the task.
 */

var http = require('https');

/**
 * @description Posts the response from Viima to requests for motd
 * @param json The json response from Viima
 */
exports.post_motd = function(json){
	if(process.env.DEBUG == 1) console.log('slack motd');
	const postData = JSON.stringify({
		"text":json.notification_header,
		"attachments": [{
			"title":"motd",
			"text":json.notification_body,
		}],
	});
	const options = {
		hostname: process.env.SLACK_HOST,
		path: process.env.SLACK_DEV_CHAN,
		method: 'POST',
		headers: {
			'Content-Type':'application/json',
			'Content-Length': Buffer.byteLength(postData),
		}
	};
	const request = http.request(options, (res) => {
		res.setEncoding('utf8');
		res.on('data', (chunk) => {
			if(process.env.DEBUG == 1) console.log('Body: ' + chunk);
		});

		res.on('end', () => {
	  	});
	});

	request.on('error', (err) => {
		console.error('problem with request: ' + err.message);
	});

	request.write(postData);
	request.end();

},

/**
 * @description Posts the result of a query from Slack.. To Slack
 * @param json The json response from Viima
 */
exports.post_status_query = function(json, params) {
	if(process.env.DEBUG == 1) console.log('slack post_activitiy');
	var postData = {
		"text":"",
		"attachments":[],
	};

	// No parameters sent, assume that user needed help
	if(params === "" || params === "help") {
		text = "This command provides x or y help example";
	} else if (json.length === 0){
		postData.text = "No results";
	} else {
		postData.text = "Results";
		for(let i = 0; i < json.length; i++){
			let obj = {
				"title":json[i].name,
				// unhard code this
				"title_link":"https://app.viima.com/ashleyksmith/innovaatioiden-hallinta/?categories=" + json[i].category + "&statuses=" + json[i].status,
			}
			postData.attachments.push(obj);
		}
	}

	jsonPostData = JSON.stringify(postData);

	const options = {
		hostname: process.env.SLACK_HOST,
		path: process.env.SLACK_DEV_CHAN,
		method: 'POST',
		headers: {
			'Content-Type':'application/json',
			'Content-Length':Buffer.byteLength(jsonPostData),
		}
	};

	const request = http.request(options, (res) =>{
	});

	request.on('error', (err) => {
		console.error('problem with request: ' + err.message);
	});

	request.write(jsonPostData);
	request.end();


},

/**
 * @description Posts a simple message to Slack
 * @param {string} msg The message to post to slack
 */
exports.post_simple = function(msg){
	if(process.env.DEBUG) console.log('slack post_simple');
	const postData = JSON.stringify({
		"text":msg.text,
		"attachments":msg.attachments,
	});

	const options = {
		hostname: process.env.SLACK_HOST,
		path: process.env.SLACK_DEV_CHAN,
		method: 'POST',
		headers: {
			'Content-Type':'application/json',
			'Content-Length': Buffer.byteLength(postData),
		}
	};

	const request = http.request(options, (res) => {
		res.setEncoding('utf8');
		res.on('data', (chunk) => {
			if(process.env.DEBUG) console.log('Body: ' + chunk);
		});

		res.on('end', () => {
		});
	});

	request.on('error', (err) => {
		console.error('problem with request: ' + err.message);
	});

	request.write(postData);
	request.end();
}
