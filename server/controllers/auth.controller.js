const db = require("../db");

class AuthController {
	async login(req, res) {
		const { userName } = req.body;
		const check = await db.query("SELECT * FROM person WHERE userName = $1", [userName]);

		return res.status(200).json({ check: check.rows[0] });
	}
}

module.exports = new AuthController();