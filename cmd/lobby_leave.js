const DiscordJS = require("discord.js"), lobbies = require("../lobbies.js");
module.exports = {
	data: new DiscordJS.SlashCommandBuilder()
	.setName("lobby_leave")
	.setDescription("Leave the lobby you're currently in"),
	async execute(interaction) {
		if (lobbies.leaveLobby(interaction.member.id)) {
			lobbies.saveData();
			await interaction.reply(`<@${interaction.member.id}> left the lobby`);
		}
		else {
			await interaction.reply({content: "You aren't in any lobby.", ephemeral: true});
		}
	}
};