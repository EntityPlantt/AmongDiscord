const DiscordJS = require("discord.js"), util = require("./util.js");
module.exports = class Game {
	#name; #lobby; #client; #channels = {}; #role; #ghostRole; players = {};
	constructor(name, lobby, client) {
		this.#name = name;
		this.#lobby = lobby;
		this.#client = client;
	}
	async start() {
		this.#role = await this.#client.guild.roles.create({
			name: this.#name,
			reason: `Game ${this.#name} has started`
		});
		this.#ghostRole = await this.#client.guild.roles.create({
			name: this.#name + " Ghost",
			reason: `Game ${this.#name} has started`
		});
		this.#lobby.participants.forEach(player => {
			this.players[player] = {
				impostor: false,
				place: 0,
				lastWalk: 0,
				emergenciesLeft: this.#lobby.options.numOfEmergencies
			};
			this.#client.guild.members.cache.get(player).roles.add(this.#role);
		});
		this.#lobby.participants.sort(() => .5 - Math.random())
			.slice(0, this.#lobby.options.impostors)
			.forEach(player => {
				this.players[player].impostor = true;
				this.players[player].lastKill = 0;
			});
		this.#channels.tasks = await this.#client.guild.channels.create({
			name: this.#name + "-tasks",
			type: DiscordJS.ChannelType.GuildText,
			reason: `Game ${this.#name} has started`,
			permissionOverwrites: [
			{
				id: this.#client.guild.roles.everyone.id,
				deny: [
				DiscordJS.PermissionsBitField.Flags.ViewChannel
				]
			},
			{
				id: this.#role.id,
				allow: [
				DiscordJS.PermissionsBitField.Flags.ViewChannel,
				DiscordJS.PermissionsBitField.Flags.UseApplicationCommands
				],
				deny: [
				DiscordJS.PermissionsBitField.Flags.SendMessages
				]
			}]
		});
		this.#channels.admin = await this.#client.guild.channels.create({
			name: this.#name + "-admin",
			type: DiscordJS.ChannelType.GuildText,
			reason: `Game ${this.#name} has started`,
			permissionOverwrites: [
			{
				id: this.#client.guild.roles.everyone.id,
				deny: [
				DiscordJS.PermissionsBitField.Flags.ViewChannel
				]
			},
			{
				id: this.#ghostRole.id,
				allow: [
				DiscordJS.PermissionsBitField.Flags.ViewChannel
				],
				deny: [
				DiscordJS.PermissionsBitField.Flags.SendMessages,
				DiscordJS.PermissionsBitField.Flags.UseApplicationCommands
				]
			}]
		});
		this.#channels.ghosts = await this.#client.guild.channels.create({
			name: this.#name + "-ghosts",
			type: DiscordJS.ChannelType.GuildText,
			reason: `Game ${this.#name} has started`,
			permissionOverwrites: [
			{
				id: this.#client.guild.roles.everyone.id,
				deny: [
				DiscordJS.PermissionsBitField.Flags.ViewChannel
				]
			},
			{
				id: this.#ghostRole.id,
				allow: [
				DiscordJS.PermissionsBitField.Flags.ViewChannel,
				DiscordJS.PermissionsBitField.Flags.SendMessages
				],
				deny: [
				DiscordJS.PermissionsBitField.Flags.UseApplicationCommands
				]
			}]
		});
		await Promise.all(Object.values(this.#channels).map(
			channel => channel.setParent(process.env.DISCORD_PLAY_CATEGORY_ID, {lockPermissions: false})
			));
		await this.#channels.tasks.send(`**The game \`${this.#name}\` has started!**

**📕 Rules**
Crewmates:
• Do tasks in ${this.#channels.tasks} to move the global tasks bar
• If you go in the place **Admin**, you will get access to ${this.#channels.admin}.
• Call an emergency with \`/emergency\` in ${this.#channels.tasks}.
This will give everyone access to the emergency channel.

Impostors:
• Pretend to do tasks in ${this.#channels.tasks} with the \`/task\` command.
• Kill players with \`/kill <player>\` when you are in the same room with another player.
You have a cooldown on the \`/kill\` command.

Ghosts:
• Talk in ${this.#channels.ghosts}.
• Do your tasks to help the alive crewmates.

**Have fun!**
`);
	}
	async walk(player, place) {
		if (this.players[player].lastWalk <= util.time() - 2500) {
			this.players[player].lastWalk = util.time();
			if (this.players[player].place == 1) {
				await this.#channels.admin.permissionOverwrites.create(this.#client.guild.cache.get(player), {
					ViewChannel: false
				});
			}
			this.players[player].place = place;
			if (this.players[player].place == 1) {
				await this.#channels.admin.permissionOverwrites.create(this.#client.guild.cache.get(player), {
					ViewChannel: true,
					SendMessages: false,
					UseApplicationCommands: false
				});
			}
			return true;
		}
		return false;
	}
	async emergency(player) {
		if (this.players[player].numOfEmergencies && !this.#channels.emergency) {
			this.players[player].numOfEmergencies--;
			this.#channels.emergency = await this.#client.guild.channels.create({
				name: this.#name + "-emergency",
				type: DiscordJS.ChannelType.GuildText,
				reason: "Emergency in " + this.#name,
				permissionOverwrites: [
				{
					id: this.#client.guild.roles.everyone.id,
					deny: [
					DiscordJS.PermissionsBitField.Flags.ViewChannel
					]
				},
				{
					id: this.#role.id,
					allow: [
					DiscordJS.PermissionsBitField.Flags.ViewChannel,
					DiscordJS.PermissionsBitField.Flags.SendMessages
					],
					deny: [
					DiscordJS.PermissionsBitField.Flags.UseApplicationCommands
					]
				},
				{
					id: this.#ghostRole.id,
					deny: [
					DiscordJS.PermissionsBitField.Flags.SendMessages
					]
				}]
			});
			return true;
		}
		return false;
	}
	async sendAdminReport() {
		await this.#channels.admin.send({
			embeds: [new DiscordJS.EmbedBuilder()
				.setName("Admin report")
				.setDescription("What's been happening these 10 seconds")
				.setColor(0x970c00)
				.setAuthor({
					name: "Among Discord",
					iconURL: this.#client.user.displayAvatarURL()
				})
				.setTimestamp()
				.addFields(...Object.keys(this.players).map(player => {
					return {
						name: `<@${player}>`,
						value: module.exports.places[this.players[player].place],
						inline: true
					};
				}))
			]
		});
	}
	isGameChannel(channelId) {
		return this.#channels.tasks == channelId
			|| this.#channels.admin == channelId
			|| this.#channels.ghosts == channelId;
	}
	async destroy() {
		await Promise.all(Object.values(this.#channels).map(channel => channel.delete("Game finished")));
		await this.#role.delete("Game finished");
		await this.#ghostRole.delete("Game finished");
	}
};
module.exports.places = "Cafeteria,Admin,Reactor,Weapons,Navigation,Shields,O2".split(",");