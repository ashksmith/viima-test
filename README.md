# Viima/Slack Test Bot
A MVP slack bot that integrates Viima with Slack. Provides simple slash command access to Viima internals from Slack. Written in a few days with no prior experience with any of the tech/products involved except from vim and Firefox. 
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
