# Viima/Slack Test Bot
A MVP slack bot that integrates Viima with Slack, written as part of the interview process. Provides simple slash command access to Viima internals from Slack. Written in a few days with no prior experience with any of the tech/products involved except from vim and Firefox. 
### Depends on
* [Node.js](https://nodejs.org/en/)
* [ngork](https://ngrok.com/) - For external access to node server. This also means that the bot slash commands need their URLs updating each time the server is restarted. Use port 3000.
* [https](https://nodejs.org/api/https.html)
* [dotenv](https://www.npmjs.com/package/dotenv)- For managing env variables
* [body-parser](https://www.npmjs.com/package/body-parser) - For taking input from slack
* [express](https://www.npmjs.com/package/express) - Super easy framework for the bot server

### Installation / Setup / Run on Linux 64bit
Bot + dependencies
```sh
$ git clone https://github.com/ashksmith/viima-test.git
$ cd viima-test
$ npm install https dotenv body-parser express
```
ngork 
```sh
$ wget https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-amd64.zip
$ unzip path/to/zip && rm *.zip
$ chmod +x ngork
$ ngork http 3000
```
As mentioned, slack requires the updated ngork URL each time it's run. It's implementation independant, configure the template .env file with the details.
Start bot
```sh
$ node skynet-server.js
```
### Usage 
The bot has 3 methods of interaction between the user, slack and viima.
```
/viima <category> <status> - Returns a list of ideas that match the status and category. It only supports the
default categories and statuses for now. 
/motd - Returns the same message that pops up when a user logs in to Viima.
```

The bot will watch for new ideas being posted, test by just adding a new idea to any board. 
