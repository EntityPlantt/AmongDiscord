const DiscordJS = require("discord.js"), lobbies = require("../lobbies.js");
module.exports = {
	data: new DiscordJS.SlashCommandBuilder()
	.setName("lobby_info_set")
	.setDescription("Set an option for the game in a lobby")
	.addStringOption(opt => opt
		.setName("name")
		.setDescription("The lobby name")
		.setRequired(true)
		)
	.addStringOption(opt => opt
		.setName("option")
		.setDescription("The option to configure")
		.addChoices(
			{name: "Number of impostors", value: "impostors"},
			{name: "Maximum amount of players", value: "maxPlayers"}
			)
		.setRequired(true)
		)
	.addIntegerOption(opt => opt
		.setName("value")
		.setDescription("The value the option to be set to")
		.setRequired(true)
		),
	async execute(interaction) {
		if (lobbies.lobbyList().includes(interaction.options.getString("name"))) {
			if (lobbies.getLobby(interaction.options.getString("name")).owner == interaction.member.id) {
				lobbies.setOption(interaction.options.getString("name"), interaction.options.getString("option"), interaction.options.getInteger("value"));
				await interaction.reply(`<@${interaction.member.id}> updated the option \`${
					interaction.options.getString("option")
				}\` of the lobby \`${
					interaction.options.getString("name")
				}\` to \`${
					interaction.options.getInteger("value")
				}\``);
			}
			else {
				await interaction.reply({content: "You aren't the lobby owner!", ephemeral: true});
			}
		}
		else {
			await interaction.reply({content: "Lobby doesn't exist.", ephemeral: true});
		}
	}
};