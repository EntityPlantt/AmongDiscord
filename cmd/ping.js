const {SlashCommandBuilder} = require("discord.js");
module.exports = {
	data: new SlashCommandBuilder()
	.setName("ping")
	.setDescription("Pong!"),
	async execute(interaction) {
		console.log("Ping -> Pong");
		await interaction.reply("Pong!");
	}
};