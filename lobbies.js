const fs = require("fs"), path = require("path");
var data;
function loadData() {
	data = JSON.parse(fs.readFileSync(path.join(__dirname, "lobbies.json"), "utf8"));
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
		options: {
			impostors: 1,
			maxPlayers: 10
		}
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
	if (lobbyJoined(user) != null || !(lobby in data)) {
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
	if (!(lobby in data) || data[lobby].owner != user) {
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
module.exports = {loadData, saveData, createLobby, joinLobby, lobbyJoined, leaveLobby, deleteLobby, getLobby, lobbyList};
loadData();