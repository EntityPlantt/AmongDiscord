const DiscordJS = require("discord.js"), util = require("../util.js");
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
			"Ping!",
			"So now what do I need to say?",
			`**Bot status**\n:green_circle: Online\n${
				util.getEmoji(interaction.guild, "shhhhhhh")
			} Ready for some Among Discord`
		];
		await interaction.reply(replyList[Math.floor(Math.random() * replyList.length)]);
	}
};