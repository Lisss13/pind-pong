
//логика игры
export default class GameLogic {

	logic() {
		let ball = game.objects.ball;

		if (this.params.state == 'game') {

			//И шарик оказался за первым игроком
			if (ball.y + ball.radius / 2 < 0) {
				// Засчтитаем гол
				this.objects.player2.rate++;
				//Сменим состояние игры
				this.params.state = 'playerwait';
				//Сохарним информацию о забившем
				this.params.lastGoalBracket = this.objects.bracket2;
				this.params.lastGoalPlayer = 'player2';
			}

			// мяч оказался за выторым игроком
			if (ball.y + ball.radius / 2 > game.params.height) {
				// гол
				this.objects.player1.rate++;
				// изменение состояние игры
				this.params.state = 'playerwait';
				// сохарним информацию о забившем
				this.params.lastGoalBracket = this.objects.bracket1;
				this.params.lastGoalPlayer = 'player1';
			}

			// проверяем наличие победителя
			if (this.objects.player1.rate === this.params.maxRate) {
				alert('выиграл 1 игрок ');
				this.restartGame();
			}

			if (this.objects.player2.rate === this.params.maxRate) {
				alert('выиграл 2 игрок ');
				this.restartGame();
			}
		}
	}

	physic() {
		// для краткости
		let ball = game.objects.ball,
			b1 = game.objects.bracket1,
			b2 = game.objects.bracket2;

		// движение мяча
		game.objects.ball.move();
		// отскок c лева
		if (ball.y + ball.radius / 2 < 0) {
			game.objects.ball.yspeed = -game.objects.ball.yspeed;
		}
		// отскок с права
		if (ball.y + ball.radius / 2 > game.params.height) {
			game.objects.ball.yspeed = -game.objects.ball.yspeed;
		}
		// отскок от границ canvas по ширине
		if (ball.x + ball.radius / 2 >= game.params.width || ball.x + ball.radius / 2 <= 0) {
			game.objects.ball.xspeed = -game.objects.ball.xspeed;
		}


		// отскок шарика от верхнего блока
		if (ball.y <= 25 && ball.x >= b1.x - 1 && ball.x <= b1.x + b1.w + 1) {
			ball.yspeed = -ball.yspeed;
			// ускоряем мяча
			ball.yspeed = ball.yspeed * ball.bounce;
		}
		// отскот шарика от нижнего блока
		if (ball.y >= this.params.height - 25 && ball.x >= b2.x - 1 && ball.x <= b2.x + b2.w + 1) {
			ball.yspeed = -ball.yspeed;
			// ускоряем мяча
			ball.yspeed = ball.yspeed * ball.bounce;
		}

		// выставление шарика возле ракетки
		if (this.params.state === 'playerwait') {
			ball.xspeed = 0;
			ball.yspeed = 0;
			if (this.params.lastGoalPlayer === 'player1') {
				ball.x = this.params.lastGoalBracket.x + this.params.lastGoalBracket.w / 2;
				ball.y = this.params.lastGoalBracket.y + this.params.lastGoalBracket.h + ball.radius + 1;
			}
			if (this.params.lastGoalPlayer === 'player2') {
				ball.x = this.params.lastGoalBracket.x + this.params.lastGoalBracket.w / 2;
				ball.y = this.params.lastGoalBracket.y - ball.radius + 1;
			}
		}

		// блоки не выходили за границу
		if (b1.x <= 0) b1.x = 0;
		if (b2.x <= 0) b2.x = 0;
		if (b1.x + b1.w >= this.params.width) b1.x = this.params.width - b1.w;
		if (b2.x + b2.w >= this.params.width) b2.x = this.params.width - b2.w;
	};

	// косание мяча
	kickBall() {
		this.objects.ball.xspeed = 3;
		this.objects.ball.yspeed = 3;
		this.params.state = 'game';
	};

}