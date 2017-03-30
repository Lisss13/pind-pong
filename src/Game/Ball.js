
//класс мячика
export default class Ball {
	constructor({inversion}) {
		this.x = 760 / 2;
		this.y = 600 / 2;
		this.radius = 8;
		this.color = '#ff0000';
		this.xspeed = 7;
		this.yspeed = 5;
		this.bounce = 1.1;
		this.inversion = inversion;
	}

	move() {
		if (this.inversion) {
			this.x = this.x + this.xspeed;
			this.y = this.y + this.yspeed;
		} else {
			this.x = this.x + -this.xspeed;
			this.y = this.y + -this.yspeed;
		}
	};

	render(ctx) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		ctx.fillStyle = this.color;
		ctx.fill();
	};
}