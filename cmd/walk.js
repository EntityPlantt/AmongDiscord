const DiscordJS = require("discord.js"), lobbies = require("../lobbies.js"), Game = require("../game.js");
module.exports = {
	data: new DiscordJS.SlashCommandBuilder()
		.setName("walk")
		.setDescription("Walk to another place")
		.addIntegerOption(opt => opt
			.setName("place")
			.setDescription("The place to go")
			.addChoices(...Game.places.map((place, index) => {
				return {name: place, value: index};
			}))
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