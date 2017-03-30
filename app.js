const express = require('express');
const {Server} = require('http');
const url = require('url');
const WebSocket = require('ws');

const constants = require('./src/constants');

const app = express();
const server = new Server(app);
const wss = new WebSocket.Server({server});

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/client/'));

let USERS = [];
let inversion = true;

/**
 * обертка над JSON.stringify
 * @param obj
 */
function json(obj) {
	return JSON.stringify(obj);
}

wss.on('connection', ws => {
	// если пользователей больше 2 в комнате то новый пользователь не допускается в игру
	if (USERS.length >= 2) {
		ws.send(json({type: constants.BUST, text: 'Комната занята, игроки не принимаются'}));
		ws.close();
		return;
	}
	let id = USERS.length;
	USERS[id] = ws;
	inversion = !inversion;
	ws.on('message', message => {
		let parseMessage = JSON.parse(message);
		let {type} = parseMessage;
		switch (type) {
			case constants.NEWUSER:
				USERS[id].name = parseMessage.name;
				for (let key in USERS) {
					USERS[key].send(json({
						type: constants.NEWUSER,
						name: USERS[id].name,
						counter: USERS.length
					}));
					if (key == id) USERS[key].send(json({type: constants.USERCONECTED, inversion}));
				}
				break;
			case constants.STARTPLAY:
				for (let key in USERS) {
					if (key != id) USERS[key].send(json({type: constants.STARTPLAY}));
				}
				break;
			case constants.MOVEBRACKET:
				for (let key in USERS) {
					if (key != id) {
						USERS[key].send(json(parseMessage));
					}
				}
				break;
			case constants.RESTARTBALL:
				for (let key in USERS) {
					USERS[key].send(json({type: constants.RESTARTBALL}));
				}
				break;
			default:
				console.log("Ошибка");
				break;
		}
	});
	ws.on('close', () => {
		console.log('соединение закрыто ' + id);
		delete USERS[id];
	});
});


server.listen(port, () => {
	console.log('Listening on %d', server.address().port);
});