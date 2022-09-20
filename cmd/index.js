const {Collection, Routes} = require("discord.js"), {readdirSync} = require("fs"), {join} = require("path");
function init(client) {
	const commands = [];
	client.commands = new Collection;
	for (var file of readdirSync(__dirname).filter(file => file.endsWith(".js"))) {
		if (file == "index.js")
			continue;
		var cmd = require(join(__dirname, file));
		client.commands.set(cmd.data.name, cmd);
		commands.push(cmd.data.toJSON());
	}
	var rest = new (require("@discordjs/rest").REST)({version: "10"}).setToken(process.env.DISCORD_API_TOKEN);
	rest.put(Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
		{body: commands})
		.then(data => console.log("Registered", data.length, "commands"))
		.catch(console.error);
}
async function fire(interaction) {
	if (interaction.client.commands.get(interaction.commandName)) {
		await interaction.client.commands.get(interaction.commandName).execute(interaction);
	}
}
module.exports = {init, fire};