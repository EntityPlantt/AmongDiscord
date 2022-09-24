const DiscordJS = require("discord.js");
module.exports = {
	data: new DiscordJS.SlashCommandBuilder()
	.setName("sus")
	.setDescription("Make someone suspicious")
	.addUserOption(opt => opt
		.setName("user")
		.setDescription("The user to make suspicious")
		.setRequired(true)
		),
	async execute(interaction) {
		const replyList = [
			"%1 is a little sus",
			"**SUS:** %1",
			"Now %2 convinced me that %1 is sus!",
			"Don't lie to me, %1! You **sussy baka**!",
			"%1 is a little bit sus, according to %2.",
			"<%2> %1 is sussy",
			"*And %2 said that %1 was acting kind of suspicious.*",
			"`SUSSY=`%1",
			"Sussy guy detected: %1",
			"%1 acted a little bit sus.",
			"And then %2 said: **%1 IS SUSSY!!!!!**",
			"Sussy guy detected: ||%1||",
			"```js\nsus_people = [\n```\n%1\n```js\n];\n```",
			"Welcome %1, to the sussy boys!",
			"This guy is a little bit sus.\nWho is he?\n%1!"
		];
		await interaction.channel.send(replyList[Math.floor(Math.random() * replyList.length)]
			.replaceAll("%1", `<@${interaction.options.getUser("user").id}>`)
			.replaceAll("%2", `<@${interaction.member.id}>`));
		await interaction.reply({content: `Made <@${interaction.options.getUser("user").id}> sussy`, ephemeral: true});
	}
};