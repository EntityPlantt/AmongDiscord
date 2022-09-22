const DiscordJS = require("discord.js"), fs = require("fs"), path = require("path");
function init(client) {
	const commands = [];
	client.commands = new DiscordJS.Collection;
	for (var file of fs.readdirSync(__dirname).filter(file => file.endsWith(".js"))) {
		if (file == "index.js")
			continue;
		var cmd = require(path.join(__dirname, file));
		client.commands.set(cmd.data.name, cmd);
		commands.push(cmd.data.toJSON());
	}
	var rest = new (require("@discordjs/rest").REST)({version: "10"}).setToken(process.env.DISCORD_API_TOKEN);
	rest.put(DiscordJS.Routes.applicationGuildCommands
		(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID), {body: commands})
		.then(data => console.log("Registered", data.length, "commands"))
		.catch(console.error);
}
async function fire(interaction) {
	if (interaction.client.commands.get(interaction.commandName)) {
		console.log("Processing command", interaction.commandName);
		try {
			await (interaction.client.commands.get(interaction.commandName).execute(interaction));
		} catch (err) {
			console.error(err);
		}
	}
}
module.exports = {init, fire};