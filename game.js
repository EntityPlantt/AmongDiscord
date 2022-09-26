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
			this.players[player] = {impostor: false, place: 0, lastWalk: 0};
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
	walk(player, place) {
		if (this.players[player].place == 1) {
			this.#channels.admin.permissionOverwrites.create(this.#client.guild.cache.get(player), {
				ViewChannel: false
			});
		}
		if (this.players[player].lastWalk <= util.time() - 2500) {
			this.players[player].lastWalk = util.time();
			this.players[player].place = place;
			if (this.players[player].place == 1) {
				this.#channels.admin.permissionOverwrites.create(this.#client.guild.cache.get(player), {
					ViewChannel: true,
					SendMessages: false,
					UseApplicationCommands: false
				});
			}
			return true;
		}
		return false;
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