console.log("Starting script...");
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
	else if (req.url == "/") {
		res.writeHead(200, {"Content-Type": "text/html"});
		res.end(readFileSync("html/index.html", "utf8"));
	}
	else if (req.url.substr(0, 8) == "/favicon.ico") {
		res.writeHead(404, {"Content-Type": "image/png"});
		res.end(readFileSync("media/logo.png", null));
	}
	else {
		res.writeHead(404, {"Content-Type": "text/html"});
		res.end(readFileSync("html/404.html", "utf8"));
	}
}).listen(process.env.PORT || 5000);