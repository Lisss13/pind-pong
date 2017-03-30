import Game from './Game/Game'
import {socket} from './SocketConf'
import {gameTemplate, userTimplate} from './component/game'
import constants from './constants'

let getStartPlay = false;
let inversionBall;

document.addEventListener("DOMContentLoaded", event => {

	let user = document.getElementById('user');
	let field = document.getElementById('container');

	let name = prompt('Ваше имя', '');

	socket.onopen = () => {
		console.log("Соединение открыто...");
		// отправка данных о новом пользователе
		socket.send(JSON.stringify({type: constants.NEWUSER, name}))
	};

	socket.onmessage = event => {
		let data = JSON.parse(event.data);
		switch (data.type) {
			// инициализация нового пользователя
			case constants.NEWUSER:
				field.innerHTML = gameTemplate(name);
				user.innerHTML = userTimplate(data.name);

				if (data.counter == 2) {
					getStartPlay = true;
				}

				let buttonStart = document.getElementById('but');
				let addUser = document.getElementById('addUser');

				buttonStart.addEventListener('click', () => {
					if (getStartPlay) {
						socket.send(JSON.stringify({type: constants.STARTPLAY}));
						window.game = new Game(inversionBall,socket);
						game.startGame();
					} else {
						addUser.innerHTML = "Ожидайте пользователя";
					}
				});
				break;
			// начало игры
			case constants.STARTPLAY:
				window.game = new Game(inversionBall, socket);
				game.startGame();
				break;
			// инверсия шарика
			case constants.USERCONECTED:
				const {inversion} = data;
				inversionBall = inversion;
				break;
			// лишний пользователь
			case constants.BUST:
				field.innerHTML = data.text
		}
	};
});