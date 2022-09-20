const {SlashCommandBuilder} = require("discord.js");
module.exports = {
	data: new SlashCommandBuilder()
	.setName("ping")
	.setDescription("Pong!"),
	async execute(interaction) {
		console.log("For ping, reply with pong");
		await interaction.reply("Pong!");
	}
};