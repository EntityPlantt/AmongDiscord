const DiscordJS = require("discord.js"), lobbies = require("../lobbies.js");
module.exports = {
	data: new DiscordJS.SlashCommandBuilder()
	.setName("lobby_delete")
	.setDescription("Delete an existing lobby")
	.addStringOption(opt => opt
		.setName("name")
		.setDescription("The lobby name")
		.setRequired(true)),
	async execute(interaction) {
		if (lobbies.deleteLobby(interaction.member.id, interaction.options.getString("name"))) {
			lobbies.saveData();
			await interaction.reply({content: `<@${interaction.member.id}> deleted the lobby \`${interaction.options.getString("name")}\``});
		}
		else {
			await interaction.reply({content: `Couldn't delete lobby, one of these is the reason:
• It doesn't exist
• You aren't the lobby owner
• Game has started in that lobby`, ephemeral: true});
		}
	}
};