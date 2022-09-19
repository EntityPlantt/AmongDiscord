const http = require("http"), {Client, GatewayIntentBits} = require("discord.js"), {readFileSync} = require("fs");
require("dotenv").config();
const client = new Client({
	intents: [GatewayIntentBits.Guilds]
});
http.createServer((req, res) => {
	if (req.url.substr(0, 7) == "/token=") {
		client.login(req.url.substr(7));
		console.log("Got access token for bot");
		res.writeHead(202, {"Content-Type": "text/html"});
		res.end(readFileSync("html/got-token.html", "utf8"));
	}
	else if (req.url == "/test") {
		res.writeHead(200, {"Content-Type": "text/html"});
		res.end(readFileSync("html/test.html", "utf8"));
	}
}).listen(process.env.PORT || 5000);