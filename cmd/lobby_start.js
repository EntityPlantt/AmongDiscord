const DiscordJS = require("discord.js"), lobbies = require("../lobbies.js");
module.exports = {
	data: new DiscordJS.SlashCommandBuilder()
	.setName("lobby_start")
	.setDescription("Start the game in the lobby you're currently in"),
	async execute(interaction) {
		if (await lobbies.startLobby(
			interaction.member.id,
			lobbies.lobbyJoined(interaction.member.id),
			interaction.client
			)) {
			lobbies.saveData();
			await interaction.reply(`<@${interaction.member.id}> started the game in \`${
				lobbies.lobbyJoined(interaction.member.id)
			}\`!`);
		}
		else {
			await interaction.reply({content: `Couldn't start game, here are some reasons:
• You aren't in any lobby
• You aren't the lobby owner
• The game has already started
• Too few players (fewer than 3)`, ephemeral: true});
		}
	}
};