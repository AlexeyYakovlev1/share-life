const { verify } = require("jsonwebtoken");

const { JWT_KEY } = process.env;

module.exports = function (allowedRoles) {
	return function (req, res, next) {
		if (!Object.entries(req.headers).length || !req.headers.authorization) {
			return res.status(400).json({ success: false, message: "Headers must exist" });
		}

		const AuthToken = req.headers.authorization.replace("Bearer", "").trim();

		if (!AuthToken) {
			return res.status(400).json({ success: false, message: "Header authorization must exist" });
		}

		verify(AuthToken, `${JWT_KEY}`, (error, result) => {
			if (error) {
				return res.status(400).json({ success: false, message: `Decode auth token failed: ${error.message}`, error })
			}

			const { roles } = result;

			for (let i = 0; i < roles.length; i++) {
				const role = roles[i];
				if (allowedRoles.includes(role)) {
					req.user = result;
					return next();
				};
			}

			return res.status(400).json({ success: false, message: `Access closed` });
		});
	}
}