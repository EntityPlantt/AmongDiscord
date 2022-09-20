console.log("Starting script...");
const http = require("http"), {Client, GatewayIntentBits} = require("discord.js"), {readFileSync} = require("fs");
require("dotenv").config();
const client = new Client({
	intents: [GatewayIntentBits.Guilds]
});
http.createServer((req, res) => {
	console.log("Request on", req.url, "by", res.socket?.remoteAddress);
	if (req.url == "/test") {
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
client.once("ready", () => {
	require("cmd/index.js").init(client);
	console.log("Logged in with token", process.env.DISCORD_API_TOKEN);
	client.on("interactionCreate", async interaction => {
		if (!interaction.isChatInputCommand())
			return;
		await require("cmd/index.js").fire(interaction);
	});
});
client.login(process.env.DISCORD_API_TOKEN);