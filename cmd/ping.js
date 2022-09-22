const DiscordJS = require("discord.js");
module.exports = {
	data: new DiscordJS.SlashCommandBuilder()
	.setName("ping")
	.setDescription("Pong!"),
	async execute(interaction) {
		await interaction.reply("Pong!");
	}
};