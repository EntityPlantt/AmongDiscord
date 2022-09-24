const DiscordJS = require("discord.js"), lobbies = require("../lobbies.js");
module.exports = {
	data: new DiscordJS.SlashCommandBuilder()
	.setName("lobby_info")
	.setDescription("Get information about an existing lobby")
	.addStringOption(opt => opt
		.setName("name")
		.setDescription("The lobby name")
		.setRequired(true)),
	async execute(interaction) {
		var data = lobbies.getLobby(interaction.options.getString("name"));
		if (data) {
			await interaction.reply(`**Lobby information**
Name: \`${interaction.options.getString("name")}\`
Participants: ${data.participants.length}
Owner: <@${data.owner}>

**Options**
\`\`\`json
${JSON.stringify(data.options, null, 2)}
\`\`\``);
		}
		else {
			await interaction.reply({content: "Lobby doesn't exist", ephemeral: true});
		}
	}
};