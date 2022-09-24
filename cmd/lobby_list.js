const DiscordJS = require("discord.js"), lobbies = require("../lobbies.js");
module.exports = {
	data: new DiscordJS.SlashCommandBuilder()
	.setName("lobby_list")
	.setDescription("List all lobbies")
	.addIntegerOption(opt => opt
		.setName("page")
		.setDescription("Page number")
		.setRequired(false)
		),
	async execute(interaction) {
		var list = lobbies.lobbyList(), page = Math.max(interaction.options.getInteger("page") ?? 1, 1);
		if (list.slice(page * 10 - 10, 10).length > 0) {
			await interaction.reply(`**Lobbies ${page * 10 - 9}-${page * 10}**${
				list.slice(page * 10 - 10, 10).map(lobby => `\n\`${lobby}\``)
			}`);
		}
		else {
			await interaction.reply(`**Lobbies ${page * 10 - 9}-${page * 10}**\n*No lobbies found*`);
		}
	}
};