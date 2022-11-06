const db = require("../db");
const toBase64 = require("../utils/toBase64.util");

const { hash, compare } = require("bcrypt");
const fs = require("fs");
const path = require("path");

const { PROJECT_ROOT } = process.env;

class UserLogics {
	constructor() {
		this.create = this.create.bind(this);
		this.update = this.update.bind(this);
		this.remove = this.remove.bind(this);
		this.getFollowersAndFollowings = this.getFollowersAndFollowings.bind(this);
	}

	_existRole(role) {
		if (!role) return;

		const queryForFindRole = `SELECT text FROM role WHERE text = $1`;
		const findRole = db.query(queryForFindRole, [role]);

		return new Promise((resolve) => resolve(findRole));
	}

	_removeComments(postId) {
		if (!postId) return;

		const queryForDeleteComments = `DELETE FROM comment WHERE post_id = $1`;
		const deleteComments = db.query(queryForDeleteComments, [postId]);

		return new Promise((resolve) => resolve(deleteComments));
	}

	_findPerson(personId) {
		if (!personId) return;

		const queryForFindPerson = `SELECT * FROM person WHERE id = $1`;
		const findPerson = db.query(queryForFindPerson, [personId]);

		return new Promise((resolve) => resolve(findPerson));
	}

	create({ userName, fullName, email, password, roles }) {
		const queryForFindPerson = `SELECT id,password FROM person WHERE email = $1`;
		const findPerson = db.query(queryForFindPerson, [email]);

		return new Promise((resolve) => resolve(findPerson))
			.then((person) => {
				if (person.rows[0]) return Promise.reject("Пользователь уже существует");
				return Promise.resolve(hash(password, 8));
			})
			.then(async (hashPassword) => {
				if (!hashPassword) return Promise.reject("Ошибка при хешировании пароля");
				if (!roles.includes("USER") || !roles.length) roles.push("USER");

				// check every role
				for (let i = 0; i < roles.length; i++) {
					const role = await this._existRole(roles[i]);
					if (!role.rows || !role.rows[0]) return Promise.reject(`Какой-то роли не хватает`);
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
			.then((person) => {
				return { success: true, message: "Пользователь создан", person: person.rows[0] };
			})
			.catch((error) => {
				throw new Error(error.message || error);
			});
	}

	remove({ id }) {
		const queryForFindPerson = `SELECT avatar FROM person WHERE id = $1`;
		const findPerson = db.query(queryForFindPerson, [id]);

		return new Promise((resolve) => resolve(findPerson))
			.then((findPerson) => {
				if (!findPerson.rows || !findPerson.rows[0]) {
					return Promise.reject("Пользователь не найден");
				}

				const userAvatarInFolder = path.relative(PROJECT_ROOT, `./templates/user/${findPerson.rows[0].avatar}`);

				// remove avatar from user folder
				if (fs.existsSync(userAvatarInFolder)) {
					fs.unlink(userAvatarInFolder, (err) => {
						if (err) {
							return Promise.reject(err.message || err);
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
					const deletePost = db.query(queryForDeletePost, [id]);

					return Promise.resolve(deletePost);
				}
			})
			.then(() => {
				const queryForDeletePerson = `DELETE FROM person WHERE id = $1`;
				const deletePerson = db.query(queryForDeletePerson, [id]);

				return Promise.resolve(deletePerson);
			})
			.then(() => {
				return { success: true, message: "Пользователь удален" };
			})
			.catch((error) => {
				throw new Error(error.message || error);
			});
	}

	getAll() {
		const queryForFindPersons = `SELECT * FROM person ORDER BY date DESC`;
		const findPersons = db.query(queryForFindPersons);

		return new Promise((resolve) => resolve(findPersons))
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

				return { success: true, persons: newPersons };
			})
			.catch((error) => {
				throw new Error(error.message || error);
			});
	}

	getOne({ id }) {
		const queryForFindPerson = `SELECT * FROM person WHERE id = $1`;
		const findPerson = db.query(queryForFindPerson, [id]);

		return new Promise((resolve) => resolve(findPerson))
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

				return { success: true, person: payload };
			})
			.catch((error) => {
				throw new Error(error.message || error);
			});
	}

	update({ id, user_name, full_name, email, oldPassword, newPassword, description }) {
		const queryForFindPerson = `SELECT * FROM person WHERE id = $1`;
		const findPerson = db.query(queryForFindPerson, [id]);

		return new Promise((resolve) => resolve(findPerson))
			.then(async (findPerson) => {
				if (!findPerson.rows || !findPerson.rows[0]) {
					return Promise.reject("Пользователь не найден");
				}

				let findPersonByEmail = null;
				let comparePassword = null;

				if (email !== findPerson.rows[0].email) {
					const queryForFindPerson = `SELECT id FROM person WHERE email = $1`;
					findPersonByEmail = db.query(queryForFindPerson, [email]);
				}

				if (newPassword) {
					if (newPassword.lenght < 6) {
						return Promise.reject("Длина нового пароля должна быть минимум 6 символов");
					}

					comparePassword = compare(oldPassword, findPerson.rows[0].password);
				}

				return Promise.all([comparePassword, findPersonByEmail, findPerson.rows[0]]);
			})
			.then(([comparePassword, findPerson, currentPerson]) => {
				if (findPerson && findPerson.rows[0]) {
					return Promise.reject("Пользователь по такому email уже существует");
				}

				let password = currentPerson.password;

				if (comparePassword === false) {
					return Promise.reject("Пароли не совпадают");
				} else if (comparePassword === true) {
					password = hash(newPassword, 8);
				}

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

				return { success: true, message: "Пользователь обновлен", person: newPerson };
			})
			.catch((error) => {
				throw new Error(error.message || error);
			});
	}

	follow({ followerId, followingId, io }) {
		const queryForFindFollow = `SELECT follower_id FROM follow WHERE user_id = $1`;
		const findFollow = db.query(queryForFindFollow, [followingId]);

		return new Promise((resolve) => resolve(findFollow))
			.then((follow) => {
				const followAsBool = Boolean(follow.rows.length && follow.rows[0].follower_id);

				io.on("connection", (socket) => io.emit("follow", followAsBool));

				if (!followAsBool) {
					const queryForCreateFollow = `INSERT INTO follow(follower_id, user_id) VALUES($1, $2) RETURNING user_id`;
					const createFollow = db.query(queryForCreateFollow, [followerId, followingId]);

					return Promise.resolve(createFollow);
				}

				const queryForDeleteFollow = `DELETE FROM follow WHERE user_id = $1`;
				const deleteFollow = db.query(queryForDeleteFollow, [followingId]);

				return Promise.resolve(deleteFollow);
			})
			.then((result) => {
				if (result.rows.length && result.rows[0].user_id) {
					const queryForUpdateFollower = `
						UPDATE person SET following = ARRAY_APPEND(following, $1) WHERE id = $2 RETURNING id
					`;
					const updateFollower = db.query(queryForUpdateFollower, [result.rows[0].user_id, followerId]);
					return Promise.resolve(updateFollower);
				}

				const queryForUpdateFollower = `UPDATE person SET following = ARRAY_REMOVE(following, $1) WHERE id = $2`;
				const updateFollower = db.query(queryForUpdateFollower, [followingId, followerId]);

				return Promise.resolve(updateFollower);
			})
			.then((follower) => {
				if (follower && follower.rows[0]) {
					const queryForUpdateFollowing = `UPDATE person SET followers = ARRAY_APPEND(followers, $1) WHERE id = $2`;
					const updateFollowing = db.query(queryForUpdateFollowing, [follower.rows[0].id, followingId]);

					return Promise.resolve(updateFollowing);
				}

				const queryForUpdateFollowing = `UPDATE person SET followers = ARRAY_REMOVE(followers, $1) WHERE id = $2`;
				const updateFollowing = db.query(queryForUpdateFollowing, [followerId, followingId]);

				return Promise.resolve(updateFollowing);
			})
			.then(() => {
				return { success: true };
			})
			.catch((error) => {
				throw new Error(error.message || error);
			});
	}

	getFollowersAndFollowings({ userId }) {
		const queryForFindPerson = `SELECT followers, following FROM person WHERE id = $1`;
		const findPerson = db.query(queryForFindPerson, [userId]);

		return new Promise((resolve) => resolve(findPerson))
			.then((findPerson) => {
				if (!findPerson.rows || !findPerson.rows[0]) {
					return Promise.reject("Пользователь не найден");
				}

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
				return { success: true, following, followers };
			})
			.catch((error) => {
				throw new Error(error.message || error);
			});
	}
}

module.exports = new UserLogics();