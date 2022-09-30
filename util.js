function getEmoji(guild, name) {
	return guild.emojis.cache.find(emoji => emoji.name == name);
}
function time() {
	return new Date().getTime();
}
function inEmoji(text) {
	return text.split("").map(val => {
		if (/[a-z]/i.test(val))
			return `:regional_indicator_${val.toLowerCase()}:`;
		if (val == "\n")
			return "\n";
		const special = Object.assign(
			"zero,one,two,three,four,five,six,seven,eight,nine".split(","),
			{
			"+": "heavy_plus_sign",
			"-": "heavy_minus_sign",
			"×": "heavy_multiplication_x",
			"÷": "heavy_division_sign",
			"$": "heavy_dollar_sign",
			"=": "heavy_equals_sign",
			"!": "exclamation",
			"?": "question",
			"#": "hash",
			"*": "asterisk",
			"√": "ballot_box_with_check",
			" ": "black_large_square"
		});
		if (typeof special[val] == "string")
			return `:${special[val]}:`;
		return "";
	}).join(" ").replaceAll(/ ?\n ?/g, "\n");
}
module.exports = {getEmoji, time, inEmoji};