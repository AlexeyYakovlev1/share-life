const AuthLogics = require("../logics/auth.logics");
const { validationResult } = require("express-validator");

class AuthController {
	login(req, res) {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ success: false, errors: errors.array() });
		}

		AuthLogics.login(req.body)
			.then((data) => res.status(200).json({ ...data }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	register(req, res) {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ success: false, errors: errors.array() });
		}

		AuthLogics.register(req.body)
			.then((data) => res.status(200).json({ ...data }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	checkAuth(req, res) {
		if (!req.user) {
			return res.status(400).json({ success: false, message: "User in request not found" });
		};

		AuthLogics.checkAuth(req.user)
			.then((data) => res.status(200).json({ ...data }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}
}

module.exports = new AuthController();