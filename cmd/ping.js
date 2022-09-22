const DiscordJS = require("discord.js");
module.exports = {
	data: new DiscordJS.SlashCommandBuilder()
	.setName("ping")
	.setDescription("Replies with 'Pong'!"),
	async execute(interaction) {
		const replyList = [
			"/pong",
			"Pong",
			"Pong!",
			"`pong`",
			"Well-hidden: ||pong||",
			"**PONG**",
			"*cricket noise*",
			"Pong dong chu ha!",
			"Ping!",
			"So now what do I need to say?",
			"**Bot status**\n:green_circle: Online\nඞ Ready for some Among Us"
		];
		await interaction.reply(replyList[Math.floor(Math.random() * replyList.length)]);
	}
};