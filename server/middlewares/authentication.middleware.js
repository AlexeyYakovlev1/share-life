const { verify } = require("jsonwebtoken");
const { JWT_KEY } = process.env;

module.exports = function (req, res, next) {
	if (!req.headers.authorization) {
		return res.status(400).json({ success: false, message: "Header authorization должен быть передан" });
	}

	const AuthToken = req.headers.authorization.replace("Bearer", "").trim();

	if (!AuthToken) {
		return res.status(400).json({ success: false, message: "Токен не найден" });
	}

	verify(AuthToken, `${JWT_KEY}`, (err, result) => {
		if (err) {
			return res.status(400).json({ success: false, message: "Доступ закрыт" });
		}

		req.user = result;
		next();
	});
}