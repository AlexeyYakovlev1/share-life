const db = require("../db");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { hash, compare } = require("bcrypt");

const { JWT_KEY } = process.env;

class AuthController {
	login(req, res) {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ success: false, errors: errors.array() });
		}

		const { email, password } = req.body;
		const queryForFindPerson = `SELECT id,password FROM person WHERE email = $1`;

		new Promise((resolve) => resolve(db.query(queryForFindPerson, [email])))
			.then((data) => {
				if (!data.rows || !data.rows[0]) return Promise.reject("User is not found");
				const comparePassword = compare(password, data.rows[0].password);
				return Promise.all([comparePassword, data.rows[0]]);
			})
			.then(([comparePassword, person]) => {
				if (!comparePassword) return Promise.reject("Compare password error");

				const payload = person;
				const token = jwt.sign(payload, `${JWT_KEY}`, { expiresIn: "24h" });

				return res.status(200).json({ success: true, token });
			})
			.catch((error) => res.status(500).json({ success: false, message: error }));
	}

	register(req, res) {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ success: false, errors: errors.array() });
		}

		const { fullName, userName, email, password } = req.body;
		const queryForFindPerson = `SELECT id,password FROM person WHERE email = $1`;

		new Promise((resolve) => resolve(db.query(queryForFindPerson, [email])))
			.then((data) => {
				if (data.rows[0]) return Promise.reject("User has been founded");
				const hashPassword = hash(password, 8);
				return Promise.resolve(hashPassword);
			})
			.then((hashPassword) => {
				if (!hashPassword) return Promise.reject("Password hash error");

				const queryForCreatePerson = `INSERT INTO person(full_name,user_name,email,password) VALUES($1,$2,$3,$4)`;
				const newPerson = db.query(queryForCreatePerson, [fullName, userName, email, hashPassword]);

				return Promise.resolve(newPerson);
			})
			.then((newPerson) => {
				return res.status(201).json({ success: true, message: "Success register", person: newPerson.rows[0] });
			})
			.catch((error) => res.status(400).json({ success: false, message: error }));
	}

	checkAuth(req, res) {
		if (!req.user) {
			return res.status(400).json({ success: false, message: "User in request not found" });
		};

		const { id } = req.user;
		const queryForFindPerson = `SELECT * FROM person WHERE id = $1`;

		new Promise((resolve) => resolve(db.query(queryForFindPerson, [id])))
			.then((data) => {
				if (!data.rows || !data.rows[0]) return Promise.reject("User is not found");

				const person = data.rows[0];
				const payload = { id: person.id, password: person.password };
				const token = jwt.sign(payload, `${JWT_KEY}`, { expiresIn: "24h" });

				return res.status(200).json({ success: true, token, person });
			})
			.catch((error) => res.status(400).json({ success: false, message: error }));
	}
}

module.exports = new AuthController();