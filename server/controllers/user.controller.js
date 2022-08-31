// files
const db = require("../db");
const toBase64 = require("../utils/toBase64.util");

// modules
const { hash, compare } = require("bcrypt");
const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

// global vars
const { PROJECT_ROOT } = process.env;

class UserController {
	constructor() {
		this.create = this.create.bind(this);
		this.update = this.update.bind(this);
		this.remove = this.remove.bind(this);
	}

	_existRole(role) {
		const queryForFindRole = `SELECT text FROM role WHERE text = $1`;
		return new Promise((resolve) => resolve(db.query(queryForFindRole, [role])));
	}

	_removeComments(postId) {
		const queryForDeleteComments = `DELETE FROM comment WHERE post_id = $1`;
		return new Promise((resolve) => resolve(db.query(queryForDeleteComments, [postId])));
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

				// check every role
				for (let i = 0; i < roles.length; i++) {
					const role = await this._existRole(roles[i]);
					if (!role.rows || !role.rows[0]) return Promise.reject(`Some role is not found`);
				}

				return Promise.resolve(hashPassword);
			})
			.then((hashPassword) => {
				const queryForCreatePerson = `
					INSERT INTO person(full_name,user_name,email,password,roles) VALUES($1,$2,$3,$4,$5) RETURNING *
				`;
				const newPerson = db.query(queryForCreatePerson, [fullName, userName, email, hashPassword, roles]);

				return Promise.resolve(newPerson);
			})
			.then((person) => res.status(201).json({ success: true, message: "User has been created", person: person.rows[0] }))
			.catch((error) => res.status(400).json({ succces: false, message: error.message, error }));
	}

	remove(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Params must exist" });
		}

		const { id } = req.params;
		const queryForFindPerson = `SELECT avatar FROM person WHERE id = $1`;

		new Promise((resolve) => resolve(db.query(queryForFindPerson, [id])))
			.then((findPerson) => {
				if (!findPerson.rows || !findPerson.rows[0]) return Promise.reject("User is not found");

				const userAvatarInFolder = path.relative(PROJECT_ROOT, `./templates/user/${findPerson.rows[0].avatar}`);

				// remove avatar from user folder
				if (fs.existsSync(userAvatarInFolder)) {
					fs.unlink(userAvatarInFolder, (err) => {
						if (err) {
							return res.status(400).json({ succces: false, message: err.message, err });
						}
					})
				}

				// find posts, then find comments and remove they (comments and posts)
				const queryForFindPosts = `SELECT id FROM post WHERE owner_id = $1`;
				const findPosts = db.query(queryForFindPosts, [id]);

				return Promise.resolve(findPosts);
			})
			.then(async (findPosts) => {
				if (findPosts.rows && findPosts.rows.length) {
					for (let i = 0; i < findPosts.rows.length; i++) {
						const post = findPosts.rows[i];
						await this._removeComments(post.id);
					}

					const queryForDeletePost = `DELETE FROM post WHERE owner_id = $1`;
					return Promise.resolve(db.query(queryForDeletePost, [id]));
				}
			})
			.then(() => {
				const queryForDeletePerson = `DELETE FROM person WHERE id = $1`;
				return Promise.resolve(db.query(queryForDeletePerson, [id]));
			})
			.then(() => res.status(200).json({ success: true, message: "User has been removed" }))
			.catch((error) => res.status(400).json({ succces: false, message: error.message, error }));
	}

	getAll(req, res) {
		const queryForFindPersons = `SELECT * FROM person`;

		new Promise((resolve) => resolve(db.query(queryForFindPersons)))
			.then((persons) => {
				const newPersons = [];

				// convert every avatar for everyone person to base64
				for (let i = 0; i < persons.rows.length; i++) {
					const person = persons.rows[i];
					const pathToAvatar = path.relative(PROJECT_ROOT, `./templates/user/${person.avatar}`);
					const payload = {
						...person,
						avatar: toBase64(pathToAvatar)
					};

					newPersons.push(payload);
				}

				return res.status(200).json({ success: true, persons: newPersons });
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
				// convert avatar to base64
				const pathToAvatar = path.relative(PROJECT_ROOT, `./templates/user/${person.rows[0].avatar}`);
				const payload = {
					...person.rows[0],
					avatar: toBase64(pathToAvatar)
				};

				return res.status(200).json({ success: true, person: payload });
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
		const { userName, fullName, email, oldPassword, newPassword, roles, avatar, description } = req.body;

		// THIS FOR ADMIN
		// if (!roles) return res.status(400).json({ success: false, message: "Roles is not found" });

		const queryForFindPerson = `SELECT * FROM person WHERE id = $1`;

		new Promise((resolve) => resolve(db.query(queryForFindPerson, [id])))
			.then(async (findPerson) => {
				if (!findPerson.rows || !findPerson.rows[0]) return Promise.reject("User is not found");

				// THIS FOR ADMIN
				// if (!roles.length || !roles.includes("USER")) roles.push("USER");

				// for (let i = 0; i < roles.length; i++) {
				// 	const role = await this._existRole(roles[i]);
				// 	if (!role.rows || !role.rows[0]) return Promise.reject(`Some role is not found`);
				// }

				let password = findPerson.rows[0].password;
				let findPersonByEmail = null;

				if (email) {
					const queryForFindPerson = `SELECT id FROM person WHERE email = $1`;
					findPersonByEmail = db.query(queryForFindPerson, [email]);
				}

				if (newPassword) {
					const comparePassword = compare(newPassword, oldPassword);

					if (!comparePassword) return Promise.reject("Compare password failed");

					password = hash(newPassword, 8);
				}

				return Promise.all([password, findPersonByEmail]);
			})
			.then(([password, findPerson]) => {
				if (findPerson && findPerson.rows[0]) return Promise.reject("User by this email finded");

				const queryForUpdatePerson = `
					UPDATE person
					SET user_name=COALESCE($1, person.user_name),
					full_name=COALESCE($2, person.full_name),
					email=COALESCE($3, person.email),
					password=COALESCE($4, person.password),
					avatar=COALESCE($5, person.avatar),
					description=COALESCE($6, person.description)
					WHERE id = $7 RETURNING *
				`;
				const updatePerson = db.query(queryForUpdatePerson, [userName, fullName, email, password, avatar, description, id]);

				return Promise.resolve(updatePerson);
			})
			.then((updatePerson) => {
				return res.status(200).json({ success: true, message: "User has been updated", person: updatePerson.rows[0] });
			})
			.catch((error) => res.status(400).json({ succces: false, message: error.message, error }));
	}
}

module.exports = new UserController();