function getEmoji(guild, name) {
	return guild.emojis.cache.find(emoji => emoji.name == name);
}
function time() {
	return new Date().getTime();
}
module.exports = {getEmoji, time};