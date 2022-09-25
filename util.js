function getEmoji(guild, name) {
	return guild.emojis.cache.find(emoji => emoji.name == name);
}
module.exports = {getEmoji};