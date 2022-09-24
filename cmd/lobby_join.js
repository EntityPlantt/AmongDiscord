const DiscordJS = require("discord.js"), lobbies = require("../lobbies.js");
module.exports = {
	data: new DiscordJS.SlashCommandBuilder()
	.setName("lobby_join")
	.setDescription("Join a created lobby")
	.addStringOption(opt => opt
		.setName("name")
		.setDescription("The lobby name")
		.setRequired(true)),
	async execute(interaction) {
		if (lobbies.joinLobby(interaction.member.id, interaction.options.getString("name"))) {
			lobbies.saveData();
			await interaction.reply(`<@${interaction.member.id}> joined the lobby \`${interaction.options.getString("name")}\``);
		}
		else {
			await interaction.reply({content: "Couldn't join lobby, you are already in another one or the lobby doesn't exist.", ephemeral: true});
		}
	}
};