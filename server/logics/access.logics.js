const db = require("../db");

class AccessLogics {
	user({ currentIdUser, pageIdUser }) {
		const queryForFindPerson = `SELECT id FROM person WHERE id = $1`;
		const findCurrentUser = db.query(queryForFindPerson, [currentIdUser]);

		return new Promise((resolve) => resolve(findCurrentUser))
			.then((findCurrentUser) => {
				if (!findCurrentUser.rows || !findCurrentUser.rows[0]) {
					return Promise.reject("Пользователь не найден");
				}

				const findPageUser = db.query(queryForFindPerson, [pageIdUser]);

				return Promise.all([findPageUser, findCurrentUser]);
			})
			.then(([findPageUser, findCurrentUser]) => {
				if (!findPageUser.rows || !findPageUser.rows[0]) {
					return Promise.reject("Пользователь не найден");
				};
				return { success: +findCurrentUser.rows[0].id === +findPageUser.rows[0].id };
			})
			.catch((error) => {
				throw new Error(error.message || error);
			});
	}

	admin({ roles }) {
		const queryForFindRole = `SELECT text FROM role WHERE text = $1`;
		const findRole = db.query(queryForFindRole, ["ADMIN"]);

		return new Promise((resolve) => resolve(findRole))
			.then((findRole) => {
				if (!findRole.rows || !findRole.rows[0].text) return Promise.reject("Доступ закрыт");
				return { success: roles.includes(findRole.rows[0].text) };
			})
			.catch((error) => {
				throw new Error(error.message || error);
			});
	}
}

module.exports = new AccessLogics();