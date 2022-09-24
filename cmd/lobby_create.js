const DiscordJS = require("discord.js"), lobbies = require("../lobbies.js");
module.exports = {
	data: new DiscordJS.SlashCommandBuilder()
	.setName("lobby_create")
	.setDescription("Create a lobby for a game")
	.addStringOption(opt => opt
		.setName("name")
		.setDescription("The lobby name")
		.setRequired(true)),
	async execute(interaction) {
		if (interaction.options.getString("name").includes("`")) {
			await interaction.reply({content: "Lobby name contains characters that are illegal.", ephemeral: true});
			return;
		}
		if (lobbies.lobbyJoined(interaction.member.id) == null) {
			if (lobbies.createLobby(interaction.member.id, interaction.options.getString("name"))) {
				lobbies.joinLobby(interaction.member.id, interaction.options.getString("name"));
				lobbies.saveData();
				await interaction.reply({content: `New lobby created by <@${interaction.member.id}>!\nJoin with \`/lobby_join name:${interaction.options.getString("name")}\``});
			}
			else {
				await interaction.reply({content: "Couldn't create lobby, lobby name already exists.", ephemeral: true});
			}
		}
		else {
			await interaction.reply({content: "Couldn't create lobby, you are already in another one.", ephemeral: true});
		}
	}
};