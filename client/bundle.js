/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
//конфигурация WebSocket
var socket = new WebSocket('ws://127.0.0.1:3000');
exports.socket = socket;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// константы для обмены данными

var NEWUSER = 'NEWUSER';
var USERCONECTED = 'USERCONECTED';
var MOVEBRACKET = 'MOVEBRACKET';
var STARTPLAY = "STARTPLAY";
var RESTARTBALL = 'RESTARTBALL';
var WINNER = 'WINNER';
var BUST = 'BUST';

module.exports = {
	NEWUSER: NEWUSER,
	USERCONECTED: USERCONECTED,
	MOVEBRACKET: MOVEBRACKET,
	STARTPLAY: STARTPLAY,
	RESTARTBALL: RESTARTBALL,
	WINNER: WINNER,
	BUST: BUST
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Game = __webpack_require__(5);

var _Game2 = _interopRequireDefault(_Game);

var _SocketConf = __webpack_require__(0);

var _game = __webpack_require__(8);

var _constants = __webpack_require__(1);

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getStartPlay = false;
var inversionBall = void 0;

document.addEventListener("DOMContentLoaded", function (event) {

	var user = document.getElementById('user');
	var field = document.getElementById('container');

	var name = prompt('Ваше имя', '');

	_SocketConf.socket.onopen = function () {
		console.log("Соединение открыто...");
		// отправка данных о новом пользователе
		_SocketConf.socket.send(JSON.stringify({ type: _constants2.default.NEWUSER, name: name }));
	};

	_SocketConf.socket.onmessage = function (event) {
		var data = JSON.parse(event.data);
		switch (data.type) {
			// инициализация нового пользователя
			case _constants2.default.NEWUSER:
				field.innerHTML = (0, _game.gameTemplate)(name);
				user.innerHTML = (0, _game.userTimplate)(data.name);

				if (data.counter == 2) {
					getStartPlay = true;
				}

				var buttonStart = document.getElementById('but');
				var addUser = document.getElementById('addUser');

				buttonStart.addEventListener('click', function () {
					if (getStartPlay) {
						_SocketConf.socket.send(JSON.stringify({ type: _constants2.default.STARTPLAY }));
						window.game = new _Game2.default(inversionBall, _SocketConf.socket);
						game.startGame();
					} else {
						addUser.innerHTML = "Ожидайте пользователя";
					}
				});
				break;
			// начало игры
			case _constants2.default.STARTPLAY:
				window.game = new _Game2.default(inversionBall, _SocketConf.socket);
				game.startGame();
				break;
			// инверсия шарика
			case _constants2.default.USERCONECTED:
				var inversion = data.inversion;

				inversionBall = inversion;
				break;
			// лишний пользователь
			case _constants2.default.BUST:
				field.innerHTML = data.text;
		}
	};
});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//класс мячика
var Ball = function () {
	function Ball(_ref) {
		var inversion = _ref.inversion;

		_classCallCheck(this, Ball);

		this.x = 760 / 2;
		this.y = 600 / 2;
		this.radius = 8;
		this.color = '#ff0000';
		this.xspeed = 7;
		this.yspeed = 5;
		this.bounce = 1.1;
		this.inversion = inversion;
	}

	_createClass(Ball, [{
		key: 'move',
		value: function move() {
			if (this.inversion) {
				this.x = this.x + this.xspeed;
				this.y = this.y + this.yspeed;
			} else {
				this.x = this.x + -this.xspeed;
				this.y = this.y + -this.yspeed;
			}
		}
	}, {
		key: 'render',
		value: function render(ctx) {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			ctx.fillStyle = this.color;
			ctx.fill();
		}
	}]);

	return Ball;
}();

exports.default = Ball;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//клас ракетки
var Bracket = function () {
	function Bracket() {
		_classCallCheck(this, Bracket);

		this.x = 0;
		this.y = 10;
		this.w = 100;
		this.h = 10;
		this.speed = 20;
		this.color = '#ffffff';
	}

	_createClass(Bracket, [{
		key: 'render',
		value: function render(ctx) {
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.w, this.h);
		}
	}]);

	return Bracket;
}();

exports.default = Bracket;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Ball = __webpack_require__(3);

var _Ball2 = _interopRequireDefault(_Ball);

var _Bracket = __webpack_require__(4);

var _Bracket2 = _interopRequireDefault(_Bracket);

var _Player = __webpack_require__(7);

var _Player2 = _interopRequireDefault(_Player);

var _GameLogic2 = __webpack_require__(6);

var _GameLogic3 = _interopRequireDefault(_GameLogic2);

var _SocketConf = __webpack_require__(0);

var _constants = __webpack_require__(1);

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// игра
var Game = function (_GameLogic) {
	_inherits(Game, _GameLogic);

	function Game(inversion, socket) {
		_classCallCheck(this, Game);

		// параметры игры
		var _this = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this));

		_this.params = {
			width: 760,
			height: 600,
			state: 'loading',
			maxRate: 10
		};
		_this.socket = socket;
		_this.inversion = inversion;
		_this.canvasBlock = document.getElementById('pingpong');
		_this.ctx = _this.canvasBlock.getContext('2d');
		//перехват событися keydown и перенос контекста в функция keyDownEvent
		document.addEventListener('keydown', function (event) {
			_this.keyDownEvent.call(_this, event);
		});
		return _this;
	}

	_createClass(Game, [{
		key: 'startGame',
		value: function startGame() {
			this.objects = { // инициализация
				ball: new _Ball2.default({ inversion: this.inversion }),
				player1: new _Player2.default(),
				player2: new _Player2.default(),
				bracket1: new _Bracket2.default(),
				bracket2: new _Bracket2.default()
			};
			this.params.state = 'game';

			this.objects.bracket1.x = this.params.width / 2 - this.objects.bracket1.w / 2;

			this.objects.bracket2.y = this.params.height - 20;
			this.objects.bracket2.x = this.params.width / 2 - this.objects.bracket1.w / 2;

			this.loop();
		}
	}, {
		key: 'loop',
		value: function loop() {
			var _this2 = this;

			// логика игры
			this.logic();
			// физика игры
			this.physic();
			// лендер игры
			this.render();

			this.requestLoop = requestAnimationFrame(function () {
				_this2.loop.call(_this2);
			});
		}
	}, {
		key: 'keyDownEvent',
		value: function keyDownEvent(event) {
			var _this3 = this;

			var kCode = event.keyCode;
			// движение соперника
			_SocketConf.socket.onmessage = function (event) {
				var data = JSON.parse(event.data);

				if (data.type == _constants2.default.MOVEBRACKET) {
					game.objects.bracket1.x = data.moveBracket;
				}
				if (data.type == _constants2.default.RESTARTBALL) {
					_this3.kickBall();
				}
			};

			// в право(стрелочка в право)
			if (kCode === 37) {
				game.objects.bracket2.x = game.objects.bracket2.x - game.objects.bracket2.speed;
				this.socket.send(JSON.stringify({
					type: _constants2.default.MOVEBRACKET,
					moveBracket: 670 - game.objects.bracket2.x
				}));
			}
			// в лево (стрелочка в лево)
			if (kCode === 39) {
				game.objects.bracket2.x = game.objects.bracket2.x + game.objects.bracket2.speed;
				this.socket.send(JSON.stringify({
					type: _constants2.default.MOVEBRACKET,
					moveBracket: 670 - game.objects.bracket2.x
				}));
			}

			// пуск шарика (пробел)
			if (kCode === 32 && game.params.state === 'playerwait') {
				this.socket.send(JSON.stringify({ type: _constants2.default.RESTARTBALL }));
			}
		}
	}, {
		key: 'renderRate',


		// атрисовка счетчика
		value: function renderRate(ctx) {
			var rateText = game.objects.player1.rate + ' : ' + game.objects.player2.rate;
			ctx.fillStyle = '#000000';
			ctx.font = "30px Arial";
			ctx.fillText(rateText, this.params.width / 2 - 30, this.params.height / 2);
		}
	}, {
		key: 'render',


		// атрисовка поля
		value: function render() {
			game.ctx.fillStyle = '#000000';
			game.ctx.fillRect(0, 0, game.params.width, game.params.height);

			game.objects.ball.render(game.ctx);
			game.objects.bracket1.render(game.ctx);
			game.objects.bracket2.render(game.ctx);
			game.renderRate(game.ctx);
		}
	}, {
		key: 'stopGame',
		value: function stopGame() {
			// изменение состояние
			this.params.state = 'stop';
			//Останавливаем цикл
			cancelAnimationFrame(this.requestLoop);

			// убираем слушателей событий
			document.removeEventListener('keydown', this.keyDownEvent);

			// чистим игровые объекты
			delete this.objects;
		}
	}, {
		key: 'pauseGame',
		value: function pauseGame() {
			this.state = 'pause';
		}
	}, {
		key: 'restartBall',


		// рестарт шарика
		value: function restartBall() {
			this.objects.ball.x = game.params.width / 2;
			this.objects.ball.y = game.params.height / 2;
			this.objects.ball.xspeed = 3;
			this.objects.ball.yspeed = 3;
		}
	}, {
		key: 'restartGame',


		// рестарт игры
		value: function restartGame() {
			this.stopGame();
			this.startGame();
		}
	}]);

	return Game;
}(_GameLogic3.default);

exports.default = Game;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//логика игры
var GameLogic = function () {
	function GameLogic() {
		_classCallCheck(this, GameLogic);
	}

	_createClass(GameLogic, [{
		key: 'logic',
		value: function logic() {
			var ball = game.objects.ball;

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
	}, {
		key: 'physic',
		value: function physic() {
			// для краткости
			var ball = game.objects.ball,
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
		}
	}, {
		key: 'kickBall',


		// косание мяча
		value: function kickBall() {
			this.objects.ball.xspeed = 3;
			this.objects.ball.yspeed = 3;
			this.params.state = 'game';
		}
	}]);

	return GameLogic;
}();

exports.default = GameLogic;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function Player() {
	_classCallCheck(this, Player);

	this.rate = 0;
};

exports.default = Player;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * отрисовка поля и приветствие пользователя
 * @param user
 * @returns {string}
 */
var gameTemplate = function gameTemplate(user) {
	return "\n\t\t\t<canvas id=\"pingpong\" width=\"760\" height=\"600\"></canvas>\n\t\t\t<div>\n\t\t\t\t<a href=\"#\" id=\"but\">\u041D\u0430\u0447\u0430\u0442\u044C</a>\n\t\t\t\t<div id=\"localeUser\">\u041F\u0440\u0438\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u0435\u043C " + user + "</div>\n\t\t\t\t<div id=\"addUser\"></div>\n\t\t\t</div>";
};
/**
 * Шаблон вывода подклювшегося пользователя
 * @param user
 * @returns {string}
 */
var userTimplate = function userTimplate(user) {
	return "<div>\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C " + user + " \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u043B\u0441\u044F</div>";
};

exports.gameTemplate = gameTemplate;
exports.userTimplate = userTimplate;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);


/***/ })
/******/ ]);