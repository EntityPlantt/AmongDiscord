const {Collection} = require("discord.js"), {readdirSync} = require("fs"), {join} = require("path");
function init(client) {
	client.commands = new Collection;
	for (var file of readdirSync(__dirname).filter(file => file.endsWith(".js"))) {
		if (file == "index.js")
			continue;
		var cmd = require(join(__dirname, file));
		client.commands.set(cmd.data.name, cmd);
	}
}
async function fire(interaction) {
	if (interaction.client.commands.get(interaction.commandName)) {
		await interaction.client.commands.get(interaction.commandName).execute(interaction);
	}
}
module.exports = {init, fire};