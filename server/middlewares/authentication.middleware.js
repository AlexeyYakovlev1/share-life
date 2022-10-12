const { verify } = require("jsonwebtoken");
const { JWT_KEY } = process.env;

module.exports = function (req, res, next) {
	if (!req.headers.authorization) {
		return res.status(400).json({ success: false, message: "Must be Authorization header!" });
	}

	const AuthToken = req.headers.authorization.replace("Bearer", "").trim();

	if (!AuthToken) {
		return res.status(400).json({ success: false, message: "Token from Authorization header failed!" });
	}

	verify(AuthToken, `${JWT_KEY}`, (err, result) => {
		if (err) {
			return res.status(400).json({ success: false, message: "Access closed" });
		}

		req.user = result;
		next();
	});
}