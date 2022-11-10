const db = require("../db");
const path = require("path");
const fs = require("fs");

const { PROJECT_ROOT } = process.env;

class AdminLogics {
	constructor() {
		this.removeUser = this.removeUser.bind(this);
	}

	_removeCommentForDeletedPost(postId, userId) {
		if (!postId || !userId) {
			throw new Error(`Required arguments not found`);
		};

		const queryForDeleteComment = `DELETE FROM comment WHERE owner_id = $1 OR post_id = $2`;
		const deletedComment = db.query(queryForDeleteComment, [userId, postId]);

		return new Promise((resolve) => resolve(deletedComment));
	}

	searchUsers({ userId }) {
		const queryForFindUser = `SELECT id,user_name,email,full_name FROM person WHERE id = $1`;
		const findUser = db.query(queryForFindUser, [userId]);

		return new Promise((resolve) => resolve(findUser))
			.then((findUser) => {
				return { success: true, person: findUser.rows[0] };
			})
			.catch((error) => {
				throw new Error(error.message || error);
			});
	}

	searchPosts({ postId }) {
		const queryForFindPost = `SELECT id,description,owner_id FROM post WHERE id = $1`;
		const findPost = db.query(queryForFindPost, [postId]);

		return new Promise((resolve) => resolve(findPost))
			.then((findPost) => {
				return { success: true, post: findPost.rows[0] };
			})
			.catch((error) => {
				throw new Error(error.message || error);
			});
	}

	searchComments({ commentId }) {
		const queryForFindComment = `SELECT id,text,owner_id,post_id FROM comment WHERE id = $1`;
		const findComment = db.query(queryForFindComment, [commentId]);

		return new Promise((resolve) => resolve(findComment))
			.then((findComment) => {
				return { success: true, comment: findComment.rows[0] };
			})
			.catch((error) => {
				throw new Error(error.message || error);
			});
	}

	removeUser({ userId }) {
		const queryForFindUser = `SELECT id FROM person WHERE id = $1`;
		const findUser = db.query(queryForFindUser, [userId]);

		return new Promise((resolve) => resolve(findUser))
			.then((findUser) => {
				// UPDATE ARRAYS FOR PERSONS AND REMOVE FOLLOW
				if (!findUser.rows || !findUser.rows[0].id) Promise.reject("Пользователь не найден");

				const queryForUpdatePerson = `
					UPDATE person SET followers = ARRAY_REMOVE(followers, $1), following = ARRAY_REMOVE(following, $1) RETURNING avatar
				`;
				const queryForUpdatePost = `
					UPDATE post SET person_id_likes = ARRAY_REMOVE(person_id_likes, $1)
				`;

				const updatePerson = db.query(queryForUpdatePerson, [userId]);
				const updatePost = db.query(queryForUpdatePost, [userId]);

				return Promise.all([updatePerson, updatePost]);
			})
			.then(([person, _]) => {
				// FIND POSTS
				const queryForFindPosts = `SELECT id FROM post WHERE owner_id = $1`;
				const findPosts = db.query(queryForFindPosts, [userId]);

				return Promise.all([findPosts, person]);
			})
			.then(async ([findPosts, person]) => {
				// REMOVE ALL COMMENTS FROM POSTS THEN POSTS FOLLOW AND USER
				if (findPosts.rows && findPosts.rows.length) {
					for (let i = 0; i < findPosts.rows.length; i++) {
						const post = findPosts.rows[i];
						await this._removeCommentForDeletedPost(post.id, userId);
					}
				}

				// remove avatar
				const pathToAvatar = path.relative(PROJECT_ROOT, `./templates/user/${person.rows[0].avatar}`);

				if (fs.existsSync(pathToAvatar)) {
					fs.unlink(pathToAvatar, (err) => {
						if (err) {
							return { success: false, message: "Ошибка при удалении аватара" };
						}
					});
				}

				const queryForDeletePosts = `DELETE FROM post WHERE owner_id = $1`;
				const queryForDeleteFollow = `DELETE FROM follow WHERE user_id = $1 OR follower_id = $1`;
				const queryForDeleteComment = `DELETE FROM comment WHERE owner_id = $1`;
				const queryForDeleteUser = `DELETE FROM person WHERE id = $1`;

				const deletedPost = db.query(queryForDeletePosts, [userId]);
				const deleteFollow = db.query(queryForDeleteFollow, [userId]);
				const deleteComment = db.query(queryForDeleteComment, [userId]);
				const deleteUser = db.query(queryForDeleteUser, [userId]);

				return Promise.all([deletedPost, deleteFollow, deleteComment, deleteUser]);
			})
			.then(() => {
				return { success: true, message: "Пользователь был удален" };
			})
			.catch((error) => {
				throw new Error(error.message || error);
			});
	}

	removePost({ idPost }) {
		const queryForFindPost = `SELECT photos FROM post WHERE id = $1`;
		const findPost = db.query(queryForFindPost, [idPost]);

		return new Promise((resolve) => resolve(findPost))
			.then((findPost) => {
				if (!findPost.rows || !findPost.rows[0]) return Promise.reject("Пост не найден");

				// remove photos
				if (findPost.rows[0].photos && findPost.rows[0].photos.length) {
					for (let i = 0; i < findPost.rows[0].photos.length; i++) {
						const photo = findPost.rows[0].photos[i];
						const postPhotoInFolder = path.relative(PROJECT_ROOT, `./templates/post/${photo}`)

						if (fs.existsSync(postPhotoInFolder)) {
							fs.unlink(postPhotoInFolder, (err) => {
								if (err) {
									return res.status(400).json({ succces: false, message: err.message, err });
								}
							})
						}
					}
				}

				// first delete comments then delete post
				const queryForDeleteComments = `DELETE FROM comment WHERE post_id = $1`;
				return Promise.resolve(db.query(queryForDeleteComments, [idPost]));
			})
			.then(() => {
				const queryForDeletePost = `DELETE FROM post WHERE id = $1`;
				return Promise.resolve(db.query(queryForDeletePost, [idPost]));
			})
			.then(() => {
				return { success: true, message: "Пост был удален" };
			})
			.catch((error) => {
				throw new Error(error.message || error);
			});
	}

	removeComment({ commentId }) {
		const queryForFindComment = `SELECT id FROM comment WHERE id = $1`;
		const findComment = db.query(queryForFindComment, [commentId]);

		return new Promise((resolve) => resolve(findComment))
			.then((findComment) => {
				if (!findComment.rows.length || !findComment.rows[0]) {
					return Promise.reject("Комментарий не найден");
				}

				const queryForDeleteComment = `DELETE FROM comment WHERE id = $1`;
				const deleteComment = db.query(queryForDeleteComment, [commentId]);

				return Promise.resolve(deleteComment);
			})
			.then(() => {
				return { success: true, message: "Комментарий был удален" };
			})
			.catch((error) => {
				throw new Error(error.message || error);
			});
	}

	changeUser({ changeUserId, roles, full_name, user_name, email }) {
		if (!roles.length || !roles.includes("USER")) {
			return res.status(400).json({ success: false, message: "Роль USER обязательна" });
		}

		const queryForFindChangeUser = `SELECT email FROM person WHERE id = $1`;
		const findChangeUser = db.query(queryForFindChangeUser, [changeUserId]);

		return new Promise((resolve) => resolve(findChangeUser))
			.then((changeUser) => {
				if (!changeUser.rows.length || !changeUser.rows[0].email) {
					return Promise.reject("Пользователь не найден");
				}

				const queryForFindUserByEmail = `SELECT id FROM person WHERE email = $1`;
				const findUserByEmail = db.query(queryForFindUserByEmail, [email]);

				return Promise.all([findUserByEmail, changeUser]);
			})
			.then(([findUser, changeUser]) => {
				if (
					findUser.rows.length &&
					findUser.rows[0].id &&
					changeUser.rows[0].email !== email
				) {
					return Promise.reject("Пользователь по такому email уже существует");
				}

				const queryForUpdatePerson = `
					UPDATE person
					SET user_name=COALESCE(NULLIF($1, ''), person.user_name),
					full_name=COALESCE(NULLIF($2, ''), person.full_name),
					email=COALESCE(NULLIF($3, ''), person.email),
					roles=$4
					WHERE id=$5
				`;
				const updatePerson = db.query(queryForUpdatePerson, [user_name, full_name, email, roles, changeUserId]);

				return Promise.resolve(updatePerson);
			})
			.then(() => {
				return { success: true, message: "Пользователь обновлен" };
			})
			.catch((error) => {
				throw new Error(error.message || error);
			});
	}
}

module.exports = new AdminLogics();