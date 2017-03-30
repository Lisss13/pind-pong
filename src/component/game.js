/**
 * отрисовка поля и приветствие пользователя
 * @param user
 * @returns {string}
 */
let gameTemplate = (user) => {
	return `
			<canvas id="pingpong" width="760" height="600"></canvas>
			<div>
				<a href="#" id="but">Начать</a>
				<div id="localeUser">Приветствуем ${user}</div>
				<div id="addUser"></div>
			</div>`;
};
/**
 * Шаблон вывода подклювшегося пользователя
 * @param user
 * @returns {string}
 */
let userTimplate = (user) => {
	return `<div>Пользователь ${user} подключился</div>`
};


export {
	gameTemplate,
	userTimplate
}