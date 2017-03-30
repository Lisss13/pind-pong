import Ball from './Ball'
import Bracket from './Bracket'
import Player from './Player'
import GameLogic from './GameLogic'
import {socket} from '../SocketConf'
import constants from '../constants'

// игра
export default class Game extends GameLogic {
	constructor(inversion, socket) {
		super();
		// параметры игры
		this.params = {
			width: 760,
			height: 600,
			state: 'loading',
			maxRate: 10
		};
		this.socket = socket;
		this.inversion = inversion;
		this.canvasBlock = document.getElementById('pingpong');
		this.ctx = this.canvasBlock.getContext('2d');
		//перехват событися keydown и перенос контекста в функция keyDownEvent
		document.addEventListener('keydown', event => {
			this.keyDownEvent.call(this, event);
		});
	}

	startGame() {
		this.objects = { // инициализация
			ball: new Ball({inversion: this.inversion}),
			player1: new Player(),
			player2: new Player(),
			bracket1: new Bracket(),
			bracket2: new Bracket()
		};
		this.params.state = 'game';

		this.objects.bracket1.x = this.params.width / 2 - this.objects.bracket1.w / 2;

		this.objects.bracket2.y = this.params.height - 20;
		this.objects.bracket2.x = this.params.width / 2 - this.objects.bracket1.w / 2;

		this.loop();
	};

	loop() {
		// логика игры
		this.logic();
		// физика игры
		this.physic();
		// лендер игры
		this.render();

		this.requestLoop = requestAnimationFrame(() => {
			this.loop.call(this);
		});
	};

	keyDownEvent(event) {
		let kCode = event.keyCode;
		// движение соперника
		socket.onmessage = event => {
			let data = JSON.parse(event.data);

			if (data.type == constants.MOVEBRACKET) {
				game.objects.bracket1.x = data.moveBracket;
			}
			if (data.type == constants.RESTARTBALL) {
				this.kickBall();
			}
		};


		// в право(стрелочка в право)
		if (kCode === 37) {
			game.objects.bracket2.x = game.objects.bracket2.x - game.objects.bracket2.speed;
			this.socket.send(JSON.stringify({
				type: constants.MOVEBRACKET,
				moveBracket: 670 - game.objects.bracket2.x
			}));
		}
		// в лево (стрелочка в лево)
		if (kCode === 39) {
			game.objects.bracket2.x = game.objects.bracket2.x + game.objects.bracket2.speed;
			this.socket.send(JSON.stringify({
				type: constants.MOVEBRACKET,
				moveBracket: 670 - game.objects.bracket2.x
			}));
		}


		// пуск шарика (пробел)
		if (kCode === 32 && game.params.state === 'playerwait') {
			this.socket.send(JSON.stringify({type: constants.RESTARTBALL}));
		}
	};

	// атрисовка счетчика
	renderRate(ctx) {
		let rateText = game.objects.player1.rate + ' : ' + game.objects.player2.rate;
		ctx.fillStyle = '#000000';
		ctx.font = "30px Arial";
		ctx.fillText(rateText, this.params.width / 2 - 30, this.params.height / 2);
	};

	// атрисовка поля
	render() {
		game.ctx.fillStyle = '#000000';
		game.ctx.fillRect(0, 0, game.params.width, game.params.height);

		game.objects.ball.render(game.ctx);
		game.objects.bracket1.render(game.ctx);
		game.objects.bracket2.render(game.ctx);
		game.renderRate(game.ctx);
	};

	stopGame() {
		// изменение состояние
		this.params.state = 'stop';
		//Останавливаем цикл
		cancelAnimationFrame(this.requestLoop);

		// убираем слушателей событий
		document.removeEventListener('keydown', this.keyDownEvent);

		// чистим игровые объекты
		delete(this.objects);
	};

	pauseGame() {
		this.state = 'pause';
	};

	// рестарт шарика
	restartBall() {
		this.objects.ball.x = game.params.width / 2;
		this.objects.ball.y = game.params.height / 2;
		this.objects.ball.xspeed = 3;
		this.objects.ball.yspeed = 3;
	};

	// рестарт игры
	restartGame() {
		this.stopGame();
		this.startGame();
	};

}