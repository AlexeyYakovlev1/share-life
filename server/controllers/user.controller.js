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
		this.getFollowersAndFollowings = this.getFollowersAndFollowings.bind(this);
	}

	_existRole(role) {
		if (!role) return;

		const queryForFindRole = `SELECT text FROM role WHERE text = $1`;
		return new Promise((resolve) => resolve(db.query(queryForFindRole, [role])));
	}

	_removeComments(postId) {
		if (!postId) return;

		const queryForDeleteComments = `DELETE FROM comment WHERE post_id = $1`;
		return new Promise((resolve) => resolve(db.query(queryForDeleteComments, [postId])));
	}

	_findPerson(personId) {
		if (!personId) return;

		const queryForFindPerson = `SELECT * FROM person WHERE id = $1`;
		return new Promise((resolve) => resolve(db.query(queryForFindPerson, [personId])));
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
		const queryForFindPersons = `SELECT * FROM person ORDER BY date DESC`;

		new Promise((resolve) => resolve(db.query(queryForFindPersons)))
			.then((persons) => {
				const newPersons = [];

				// convert every avatar for everyone person to base64
				for (let i = 0; i < persons.rows.length; i++) {
					const person = persons.rows[i];
					const pathToAvatar = path.relative(PROJECT_ROOT, `./templates/user/${person.avatar}`);
					const payload = {
						...person,
						avatar: {
							base64: toBase64(pathToAvatar),
							filename: person.avatar
						}
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
					avatar: {
						base64: toBase64(pathToAvatar),
						filename: person.rows[0].avatar
					}
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
		const { user_name, full_name, email, oldPassword, newPassword, description } = req.body;

		const queryForFindPerson = `SELECT * FROM person WHERE id = $1`;

		new Promise((resolve) => resolve(db.query(queryForFindPerson, [id])))
			.then(async (findPerson) => {
				if (!findPerson.rows || !findPerson.rows[0]) return Promise.reject("User is not found");

				let findPersonByEmail = null;
				let comparePassword = null;

				if (email !== findPerson.rows[0].email) {
					const queryForFindPerson = `SELECT id FROM person WHERE email = $1`;
					findPersonByEmail = db.query(queryForFindPerson, [email]);
				}

				if (newPassword) {
					if (newPassword.lenght < 6) {
						return Promise.reject("Length new password must be minimum 6 symbols");
					}

					comparePassword = compare(oldPassword, findPerson.rows[0].password);
				}

				return Promise.all([comparePassword, findPersonByEmail, findPerson.rows[0]]);
			})
			.then(([comparePassword, findPerson, currentPerson]) => {
				if (findPerson && findPerson.rows[0]) return Promise.reject("User by this email finded");

				let password = currentPerson.password;

				if (comparePassword === false) return Promise.reject("Compare password failed");
				else if (comparePassword === true) password = hash(newPassword, 8);

				return Promise.resolve(password);
			})
			.then((password) => {
				const queryForUpdatePerson = `
					UPDATE person
					SET user_name=COALESCE(NULLIF($1,''), person.user_name),
					full_name=COALESCE(NULLIF($2, ''), person.full_name),
					email=COALESCE(NULLIF($3, ''), person.email),
					password=$4,
					description=COALESCE(NULLIF($5, ''), person.description)
					WHERE id = $6 RETURNING *
				`;
				const updatePerson = db.query(queryForUpdatePerson, [user_name, full_name, email, password, description, id]);

				return Promise.resolve(updatePerson);
			})
			.then((updatePerson) => {
				const pathToAvatar = path.relative(PROJECT_ROOT, `./templates/user/${updatePerson.rows[0].avatar}`);
				const newPerson = {
					...updatePerson.rows[0],
					avatar: {
						base64: toBase64(pathToAvatar),
						filename: updatePerson.rows[0].avatar
					}
				};

				return res.status(200).json({ success: true, message: "User has been updated", person: newPerson });
			})
			.catch((error) => res.status(400).json({ succces: false, message: error.message, error }));
	}

	follow(req, res) {
		const { id: followerId } = req.user;
		const { id: followingId } = req.params;

		const queryForFindFollow = `SELECT follower_id FROM follow WHERE user_id = $1`;

		new Promise((resolve) => resolve(db.query(queryForFindFollow, [followingId])))
			.then((follow) => {
				const followAsBool = Boolean(follow.rows.length && follow.rows[0].follower_id);
				const io = req.app.get("socketio");

				io.on("connection", (socket) => io.emit("follow", followAsBool));

				if (!followAsBool) {
					const queryForCreateFollow = `INSERT INTO follow(follower_id, user_id) VALUES($1, $2) RETURNING user_id`;
					return Promise.resolve(db.query(queryForCreateFollow, [followerId, followingId]));
				}

				const queryForDeleteFollow = `DELETE FROM follow WHERE user_id = $1`;
				return Promise.resolve(db.query(queryForDeleteFollow, [followingId]));
			})
			.then((result) => {
				if (result.rows.length && result.rows[0].user_id) {
					const queryForUpdateFollower = `
						UPDATE person SET following = ARRAY_APPEND(following, $1) WHERE id = $2 RETURNING id
					`;
					return Promise.resolve(db.query(queryForUpdateFollower, [result.rows[0].user_id, followerId]));
				}

				const queryForUpdateFollower = `UPDATE person SET following = ARRAY_REMOVE(following, $1) WHERE id = $2`;
				return Promise.resolve(db.query(queryForUpdateFollower, [followingId, followerId]));
			})
			.then((follower) => {
				if (follower && follower.rows[0]) {
					const queryForUpdateFollowing = `UPDATE person SET followers = ARRAY_APPEND(followers, $1) WHERE id = $2`;
					return Promise.resolve(db.query(queryForUpdateFollowing, [follower.rows[0].id, followingId]));
				}

				const queryForUpdateFollowing = `UPDATE person SET followers = ARRAY_REMOVE(followers, $1) WHERE id = $2`;
				return Promise.resolve(db.query(queryForUpdateFollowing, [followerId, followingId]));
			})
			.then((result) => res.status(200).json({ success: true }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	getFollowersAndFollowings(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Params must exist" });
		}

		const { id: userId } = req.params;
		const queryForFindPerson = `SELECT followers, following FROM person WHERE id = $1`;
		const findPerson = db.query(queryForFindPerson, [userId]);

		new Promise((resolve) => resolve(findPerson))
			.then((findPerson) => {
				if (!findPerson.rows || !findPerson.rows[0]) return Promise.reject("User is not found");

				const person = findPerson.rows[0];

				const postpone = async (from) => {
					const result = [];

					for (let i = 0; i < from.length; i++) {
						const id = from[i];
						const find = await this._findPerson(id);

						if (find.rows && find.rows[0]) {
							// convert avatars to base64 and push to followers
							const user = find.rows[0];
							const filePath = path.relative(PROJECT_ROOT, `./templates/user/${user.avatar}`);
							const avatarInBase64 = toBase64(filePath);
							const obj = {
								...user,
								avatar: {
									base64: avatarInBase64,
									filename: user.avatar
								}
							};

							result.push(obj);
						}
					}

					return result;
				}

				const followers = postpone(person.followers);
				const following = postpone(person.following);

				return Promise.all([followers, following]);
			})
			.then(([followers, following]) => {
				return res.status(200).json({ success: true, following, followers });
			})
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}
}

module.exports = new UserController();