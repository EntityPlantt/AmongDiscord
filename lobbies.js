const fs = require("fs"), path = require("path"), Game = require("./game.js");
var data, options = {
	impostors: {
		name: "Number of impostors",
		value: 1,
		min: 1,
		max: 3
	},
	maxPlayers: {
		name: "Maximum amount of players",
		value: 10,
		min: 5,
		max: 20
	},
	numOfEmergencies: {
		name: "Number of emergencies by player",
		value: 5,
		min: 0,
		max: 999
	},
	numOfTasks: {
		name: "Numer of tasks to be completed",
		value: 5,
		min: 1,
		max: 25
	},
	walkCooldown: {
		name: "Walk cooldown (in ms)",
		value: 2500,
		min: 200,
		max: 10000
	}
};
function defaultOptions() {
	var obj = {};
	for (var i of Object.keys(options)) {
		obj[i] = options[i].value;
	}
	return obj;
}
function loadData() {
	data = JSON.parse(fs.readFileSync(path.join(__dirname, "lobbies.json"), "utf8"));
	for (var i of Object.keys(data)) {
		if (data[i].started) {
			Object.setPrototypeOf(data[i].game, Game.prototype);
		}
	}
}
function saveData() {
	fs.writeFileSync(path.join(__dirname, "lobbies.json"), JSON.stringify(data), "utf8");
}
function createLobby(owner, name) {
	if (data[name]) {
		return false;
	}
	data[name] = {
		owner,
		participants: [owner],
		options: defaultOptions(),
		started: false
	};
	return true;
}
function lobbyJoined(user) {
	for (var lobby of Object.keys(data)) {
		if (data[lobby].participants.includes(user)) {
			return lobby;
		}
	}
	return null;
}
function joinLobby(user, lobby) {
	if (lobbyJoined(user) != null || !(lobby in data) || data[lobby].started) {
		return false;
	}
	data[lobby].participants.push(user);
	return true;
}
function leaveLobby(user) {
	var lobby = lobbyJoined(user);
	if (lobby == null) {
		return false;
	}
	data[lobby].participants.splice(data[lobby].participants.indexOf(user), 1);
	return true;
}
function deleteLobby(user, lobby) {
	if (!(lobby in data) || data[lobby].owner != user || data[lobby].started) {
		return false;
	}
	delete data[lobby];
	return true;
}
function getLobby(lobby) {
	return data[lobby] ?? null;
}
function lobbyList() {
	return Object.keys(data);
}
function setOption(lobby, option, value) {
	if (value < options[option].min || value > options[option].max) {
		return false;
	}
	return data[lobby].options[option] = value;
	return true;
}
function optionData(option) {
	return options[option];
}
async function startGame(user, lobby, client) {
	if (!(lobby in data) || data[lobby].owner != user || data[lobby].started) {
		return false;
	}
	data.started = true;
	data.game = new Game(lobby, data[lobby], client);
	await data.game.start();
	return data.game;
}
function getGame(lobby) {
	return data[lobby]?.game ?? null;
}
function inGame(user) {
	return data[lobbyJoined(user)]?.game ?? null;
}
module.exports = {
	loadData, saveData, createLobby, joinLobby,
	lobbyJoined, leaveLobby, deleteLobby, getLobby,
	lobbyList, setOption, defaultOptions, optionData,
	startGame, getGame, inGame
};
loadData();