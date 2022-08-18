const db = require("../db");
const { hash } = require("bcrypt");
const { validationResult } = require("express-validator");

class UserController {
	constructor() {
		this.create = this.create.bind(this);
		this.update = this.update.bind(this);
	}

	_existRole(role) {
		const queryForFindRole = `SELECT text FROM role WHERE text = $1`;
		return new Promise((resolve) => resolve(db.query(queryForFindRole, [role])));
	}

	create(req, res) {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ success: false, errors: errors.array() });
		}

		const { userName, fullName, email, password, roles } = req.body;
		const queryForFindPerson = `SELECT id,password FROM person WHERE email = $1`;

		if (!roles) return res.status(400).json({ success: false, message: "Roles is not found" });

		new Promise((resolve) => resolve(db.query(queryForFindPerson, [email])))
			.then((person) => {
				if (person.rows[0]) return Promise.reject("User found");
				return Promise.resolve(hash(password, 8));
			})
			.then(async (hashPassword) => {
				if (!hashPassword) return Promise.reject("Hash password failed");

				if (!roles.includes("USER") || !roles.length) roles.push("USER");

				for (let i = 0; i < roles.length; i++) {
					const role = await this._existRole(roles[i]);
					if (!role.rows || !role.rows[0]) return Promise.reject(`Some role is not found`);
				}

				return Promise.resolve(hashPassword);
			})
			.then((hashPassword) => {
				const queryForCreatePerson = `INSERT INTO person(full_name,user_name,email,password,roles) VALUES($1,$2,$3,$4,$5) RETURNING *`;
				const newPerson = db.query(queryForCreatePerson, [fullName, userName, email, hashPassword, roles]);

				return Promise.resolve(newPerson);
			})
			.then((person) => {
				return res.status(201).json({ success: true, message: "User has been created", person: person.rows[0] });
			})
			.catch((error) => res.status(400).json({ succces: false, message: error.message, error }));
	}

	remove(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Params must exist" });
		}

		const { id } = req.params;
		const queryForFindPerson = `SELECT email FROM person WHERE id = $1`;

		new Promise((resolve) => resolve(db.query(queryForFindPerson, [id])))
			.then((findPerson) => {
				if (!findPerson.rows || !findPerson.rows[0]) return Promise.reject("User is not found");

				const queryForRemovePerson = `DELETE FROM person WHERE id = $1`;
				return Promise.resolve(db.query(queryForRemovePerson, [id]));
			})
			.then(() => {
				return res.status(200).json({ success: true, message: "User has been removed" });
			})
			.catch((error) => res.status(400).json({ succces: false, message: error.message, error }));
	}

	getAll(req, res) {
		const queryForFindPersons = `SELECT * FROM person`;
		new Promise((resolve) => resolve(db.query(queryForFindPersons)))
			.then((persons) => {
				return res.status(200).json({ success: true, persons: persons.rows });
			})
			.catch((error) => res.status(400).json({ succces: false, message: error.message, error }));
	}

	getOne(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Params must exist" });
		}

		const { id } = req.params;
		const queryForFindPerson = `SELECT * FROM person WHERE id = $1`;
		new Promise((resolve) => resolve(db.query(queryForFindPerson, [id])))
			.then((person) => {
				return res.status(200).json({ success: true, person: person.rows[0] });
			})
			.catch((error) => res.status(400).json({ succces: false, message: error.message, error }));
	}

	update(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Params must exist" });
		}

		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ success: false, errors: errors.array() });
		}

		const { id } = req.params;
		const { userName, fullName, email, password, roles } = req.body;

		if (!roles) return res.status(400).json({ success: false, message: "Roles is not found" });

		const queryForFindPerson = `SELECT * FROM person WHERE id = $1`;

		new Promise((resolve) => resolve(db.query(queryForFindPerson, [id])))
			.then(async (findPerson) => {
				if (!findPerson.rows || !findPerson.rows[0]) return Promise.reject("User is not found");
				if (!roles.length || !roles.includes("USER")) roles.push("USER");

				for (let i = 0; i < roles.length; i++) {
					const role = await this._existRole(roles[i]);
					if (!role.rows || !role.rows[0]) return Promise.reject(`Some role is not found`);
				}

				const hashPassword = hash(password, 8);
				return Promise.resolve(hashPassword);
			})
			.then((hashPassword) => {
				if (!hashPassword) {
					return res.status(400).json({ success: false, message: "Hash password failed" });
				}

				const queryForUpdatePerson = `UPDATE person SET user_name=$1,full_name=$2,email=$3,password=$4,roles=$5 WHERE id = $6  RETURNING *`;
				const updatePerson = db.query(queryForUpdatePerson, [userName, fullName, email, hashPassword, roles, id]);

				return Promise.resolve(updatePerson);
			})
			.then((updatePerson) => {
				return res.status(200).json({ success: true, message: "User has been updated", person: updatePerson.rows[0] });
			})
			.catch((error) => res.status(400).json({ succces: false, message: error.message, error }));
	}
}

module.exports = new UserController();