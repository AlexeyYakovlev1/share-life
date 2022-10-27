const db = require("../db");

class AccessController {
	user(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Params must exist" });
		}

		const { id: currentIdUser } = req.params;
		const { id: pageIdUser } = req.user;

		const queryForFindPerson = `SELECT id FROM person WHERE id = $1`;
		const findCurrentUser = db.query(queryForFindPerson, [currentIdUser]);

		new Promise((resolve) => resolve(findCurrentUser))
			.then((findCurrentUser) => {
				if (!findCurrentUser.rows || !findCurrentUser.rows[0]) return Promise.reject("User is not found");
				const findPageUser = db.query(queryForFindPerson, [pageIdUser]);

				return Promise.all([findPageUser, findCurrentUser]);
			})
			.then(([findPageUser, findCurrentUser]) => {
				if (!findPageUser.rows || !findPageUser.rows[0]) return Promise.reject("User is not found");
				return res.status(200).json({ success: +findCurrentUser.rows[0].id === +findPageUser.rows[0].id });
			})
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	admin(req, res) {
		const { roles } = req.user;

		const queryForFindRole = `SELECT text FROM role WHERE text = $1`;
		const findRole = db.query(queryForFindRole, ["ADMIN"]);

		new Promise((resolve) => resolve(findRole))
			.then((findRole) => {
				if (!findRole.rows || !findRole.rows[0].text) return Promise.reject("Access closed");
				return res.status(200).json({ success: roles.includes(findRole.rows[0].text) });
			})
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}
}

module.exports = new AccessController();