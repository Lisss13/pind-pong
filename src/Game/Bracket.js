
//клас ракетки
export default class Bracket {
	constructor() {
		this.x = 0;
		this.y = 10;
		this.w = 100;
		this.h = 10;
		this.speed = 20;
		this.color = '#ffffff';
	}

	render(ctx) {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.w, this.h);
	};
}