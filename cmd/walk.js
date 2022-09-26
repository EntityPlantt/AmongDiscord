const DiscordJS = require("discord.js"), lobbies = require("../lobbies.js");
module.exports = {
	data: new DiscordJS.SlashCommandBuilder()
		.setName("walk")
		.setDescription("Walk to another place")
		.addIntegerOption(opt => opt
			.setName("place")
			.setDescription("The place to go")
			.addChoices(
				{name: "Cafeteria", value: 0},
				{name: "Admin", value: 1},
				{name: "Reactor", value: 2},
				{name: "Weapons", value: 3},
				{name: "Navigation", value: 4},
				{name: "Shields", value: 5},
				{name: "O2", value: 6}
				)
			.setRequired(true)
			),
	async execute(interaction) {
		if (lobbies.inGame(interaction.member.id)
			&& lobbies.inGame(interaction.member.id).isGameChannel(interaction.channel.id)) {
			if (await (lobbies.inGame(interaction.member.id).walk(interaction.member.id, interaction.options.getInteger("place")))) {
				await interaction.reply({content: "Went to place.", ephemeral: true});
			}
			else {
				await interaction.reply({content: "You are tired. Please wait a little.", ephemeral: true});
			}
		}
		else {
			await interaction.reply({content: "You can't use this command here.", ephemeral: true});
		}
	}
}