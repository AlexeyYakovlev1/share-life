const db = require("../db");
const { validationResult } = require("express-validator");

class CommentController {
	create(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Params must exist" });
		}

		if (!Object.entries(req.body).length || !req.body.text) {
			return res.status(400).json({ success: false, message: "Body must exist" });
		}

		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ success: false, errors: errors.array() });
		}

		const { id: idPost } = req.params;
		const { id: idCurrentUser } = req.user;
		const { text } = req.body;

		const queryForFindPerson = `SELECT email FROM person WHERE id = $1`;

		new Promise((resolve) => resolve(db.query(queryForFindPerson, [idCurrentUser])))
			.then((findPerson) => {
				if (!findPerson.rows || !findPerson.rows[0]) return Promise.reject("User is not found");

				const queryForFindPost = `SELECT owner_id FROM post WHERE id = $1`;
				const findPost = db.query(queryForFindPost, [idPost]);

				return Promise.resolve(findPost);
			})
			.then((findPost) => {
				if (!findPost.rows || !findPost.rows[0]) return Promise.reject("Post is not found");

				const queryForCreateComment = `INSERT INTO comment(text,owner_id,post_id) VALUES($1,$2,$3) RETURNING *`;
				const newComment = db.query(queryForCreateComment, [text, idCurrentUser, idPost]);

				return Promise.resolve(newComment);
			})
			.then((newComment) => {
				// send comment to client
				const io = req.app.get("socketio");

				io.on("connection", (socket) => {
					io.emit("comment", newComment.rows[0]);
				});

				return res.status(201).json({ success: true, message: "Comment has been created", comment: newComment.rows[0] });
			})
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	remove(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Params must exist" });
		}

		const { id: idCurrentUser } = req.user;
		const { id: idComment } = req.params;

		const queryForFindPerson = `SELECT email FROM person WHERE id = $1`;

		new Promise((resolve) => resolve(db.query(queryForFindPerson, [idCurrentUser])))
			.then((findPerson) => {
				if (!findPerson.rows || !findPerson.rows[0]) return Promise.reject("User is not found");

				const queryForFindComment = `SELECT owner_id FROM comment WHERE id = $1`;
				const findComment = db.query(queryForFindComment, [idComment]);

				return Promise.resolve(findComment);
			})
			.then((findComment) => {
				if (!findComment.rows || !findComment.rows[0]) return Promise.reject("Comment is not found");
				if (+idCurrentUser !== +findComment.rows[0].owner_id) return Promise.reject("Access closed");

				const queryForDeleteComment = `DELETE FROM comment WHERE id = $1`;
				return Promise.resolve(db.query(queryForDeleteComment, [idComment]));
			})
			.then(() => res.status(200).json({ success: true, message: "Comment has been removed" }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	getAllByPostId(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Params must exist" });
		}

		const { id: idPost } = req.params;

		const queryForGetComments = `SELECT * FROM comment WHERE post_id = $1`;
		const findComments = db.query(queryForGetComments, [idPost]);

		new Promise((resolve) => resolve(findComments))
			.then((findComments) => res.status(200).json({ success: true, comments: findComments.rows }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	getAll(req, res) {
		const queryForFindComments = `SELECT * FROM comment`;
		const comments = db.query(queryForFindComments);

		new Promise((resolve) => resolve(comments))
			.then((comments) => res.status(200).json({ success: true, comments: comments.rows }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}
}

module.exports = new CommentController();