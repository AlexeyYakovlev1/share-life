const db = require("../db");
const toBase64 = require("../utils/toBase64.util");

const { compare, hash } = require("bcrypt");
const { relative } = require("path");
const { sign } = require("jsonwebtoken");

const { JWT_KEY, PROJECT_ROOT } = process.env;

class AuthLogics {
	login({ email, password }) {
		const queryForFindPerson = `SELECT * FROM person WHERE email = $1`;
		const findPerson = db.query(queryForFindPerson, [email]);

		return new Promise((resolve) => resolve(findPerson))
			.then((data) => {
				if (!data.rows || !data.rows[0]) {
					return Promise.reject("Пользователь не найден");
				}

				const comparePassword = compare(password, data.rows[0].password);
				return Promise.all([comparePassword, data.rows[0]]);
			})
			.then(([comparePassword, person]) => {
				if (!comparePassword) {
					return Promise.reject("Пароли не совпадают");
				}

				const payload = { id: person.id, password: person.password, roles: person.roles };
				const avatarInBase64 = toBase64(relative(PROJECT_ROOT, `./templates/user/${person.avatar}`));

				const personToClient = {
					...person,
					avatar: {
						base64: avatarInBase64,
						filename: person.avatar
					}
				};
				const token = sign(payload, `${JWT_KEY}`, { expiresIn: "24h" });

				return { success: true, token, person: personToClient };
			})
			.catch((error) => {
				throw new Error(error.message || error);
			});
	}

	register({ fullName, userName, email, password }) {
		const queryForFindPerson = `SELECT id,password FROM person WHERE email = $1`;

		return new Promise((resolve) => resolve(db.query(queryForFindPerson, [email])))
			.then((data) => {
				if (data.rows[0]) return Promise.reject("Пользователь уже существует");
				const hashPassword = hash(password, 8);
				return Promise.resolve(hashPassword);
			})
			.then((hashPassword) => {
				if (!hashPassword) return Promise.reject("Ошибка при хешировании пароля");
				const queryForFindRole = `SELECT text FROM role WHERE text = $1`;
				const role = db.query(queryForFindRole, ["USER"]);

				return Promise.all([role, hashPassword]);
			})
			.then(([role, hashPassword]) => {
				if (!role.rows || !role.rows[0]) return Promise.reject("Роль не найдена");

				const queryForCreatePerson = `INSERT INTO person(full_name,user_name,email,password,roles) VALUES($1,$2,$3,$4,$5)`;
				const newPerson = db.query(queryForCreatePerson, [fullName, userName, email, hashPassword, [role.rows[0].text]]);

				return Promise.resolve(newPerson);
			})
			.then((person) => {
				return { success: true, message: "Регистрация прошла успешно", person: person.rows[0] };
			})
			.catch((error) => {
				throw new Error(error.message || error);
			});
	}

	checkAuth({ id }) {
		const queryForFindPerson = `SELECT * FROM person WHERE id = $1`;

		return new Promise((resolve) => resolve(db.query(queryForFindPerson, [id])))
			.then((data) => {
				if (!data.rows || !data.rows[0]) return Promise.reject("Пользователь не найден");
				const avatarInBase64 = toBase64(relative(PROJECT_ROOT, `./templates/user/${data.rows[0].avatar}`));

				const person = {
					...data.rows[0],
					avatar: {
						base64: avatarInBase64,
						filename: data.rows[0].avatar
					}
				};
				const payload = { id: person.id, password: person.password, roles: person.roles };
				const token = sign(payload, `${JWT_KEY}`, { expiresIn: "24h" });

				return { success: true, token, person };
			})
			.catch((error) => {
				throw new Error(error.message || error);
			});
	}
}

module.exports = new AuthLogics();