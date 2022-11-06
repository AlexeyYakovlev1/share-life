const db = require("../db");

class CommentLogics {
	create({ idPost, idCurrentUser, text, io }) {
		const queryForFindPerson = `SELECT email FROM person WHERE id = $1`;

		return new Promise((resolve) => resolve(db.query(queryForFindPerson, [idCurrentUser])))
			.then((findPerson) => {
				if (!findPerson.rows || !findPerson.rows[0]) {
					return Promise.reject("Пользователь не найден");
				}

				const queryForFindPost = `SELECT owner_id FROM post WHERE id = $1`;
				const findPost = db.query(queryForFindPost, [idPost]);

				return Promise.resolve(findPost);
			})
			.then((findPost) => {
				if (!findPost.rows || !findPost.rows[0]) {
					return Promise.reject("Пост не найден");
				}

				const queryForCreateComment = `INSERT INTO comment(text,owner_id,post_id) VALUES($1,$2,$3) RETURNING *`;
				const newComment = db.query(queryForCreateComment, [text, idCurrentUser, idPost]);

				return Promise.resolve(newComment);
			})
			.then((newComment) => {
				io.on("connection", () => io.emit("comment", newComment.rows[0]));

				return { success: true, message: "Комментарий создан", comment: newComment.rows[0] };
			})
			.catch((error) => {
				throw new Error(error.message || error);
			});
	}

	remove({ idCurrentUser, idComment }) {
		const queryForFindPerson = `SELECT email FROM person WHERE id = $1`;

		return new Promise((resolve) => resolve(db.query(queryForFindPerson, [idCurrentUser])))
			.then((findPerson) => {
				if (!findPerson.rows || !findPerson.rows[0]) {
					return Promise.reject("Пользователь не найден");
				}

				const queryForFindComment = `SELECT owner_id FROM comment WHERE id = $1`;
				const findComment = db.query(queryForFindComment, [idComment]);

				return Promise.resolve(findComment);
			})
			.then((findComment) => {
				if (!findComment.rows || !findComment.rows[0]) {
					return Promise.reject("Комментарий не найден");
				}
				if (+idCurrentUser !== +findComment.rows[0].owner_id) {
					return Promise.reject("Доступ закрыт");
				}

				const queryForDeleteComment = `DELETE FROM comment WHERE id = $1`;
				const deleteComment = db.query(queryForDeleteComment, [idComment]);

				return Promise.resolve(deleteComment);
			})
			.then(() => {
				return { success: true, message: "Комментарий удален" };
			})
			.catch((error) => {
				throw new Error(error.message || error);
			});
	}

	getAllByPostId({ idPost }) {
		const queryForGetComments = `SELECT * FROM comment WHERE post_id = $1`;
		const findComments = db.query(queryForGetComments, [idPost]);

		return new Promise((resolve) => resolve(findComments))
			.then((findComments) => {
				return { success: true, comments: findComments.rows };
			})
			.catch((error) => {
				throw new Error(error.message || error);
			});
	}

	getAll() {
		const queryForFindComments = `SELECT * FROM comment ORDER BY date DESC`;
		const comments = db.query(queryForFindComments);

		return new Promise((resolve) => resolve(comments))
			.then((comments) => {
				return { success: true, comments: comments.rows };
			})
			.catch((error) => {
				throw new Error(error.message || error);
			});
	}
}

module.exports = new CommentLogics();