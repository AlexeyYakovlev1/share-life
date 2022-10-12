const db = require("../db");

class AdminController {
	// search by id for users
	searchUsers(req, res) {
		if (!Object.entries(req.query).length || !req.query.q) {
			return res.status(400).json({ success: false, message: "Query `q` must be" });
		}

		const { q: userId } = req.query;

		const queryForFindUser = `SELECT id,user_name,email,full_name FROM person WHERE id = $1`;
		const findUser = db.query(queryForFindUser, [userId]);

		new Promise((resolve) => resolve(findUser))
			.then((findUser) => res.status(200).json({ success: true, person: findUser.rows[0] }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	// search by id for posts
	searchPosts(req, res) {
		if (!Object.entries(req.query).length || !req.query.q) {
			return res.status(400).json({ success: false, message: "Query `q` must be" });
		}

		const { q: postId } = req.query;

		const queryForFindPost = `SELECT id,description,owner_id FROM post WHERE id = $1`;
		const findPost = db.query(queryForFindPost, [postId]);

		new Promise((resolve) => resolve(findPost))
			.then((findPost) => res.status(200).json({ success: true, post: findPost.rows[0] }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	// search by id for comments
	searchComments(req, res) {
		if (!Object.entries(req.query).length || !req.query.q) {
			return res.status(400).json({ success: false, message: "Query `q` must be" });
		}

		const { q: commentId } = req.query;

		const queryForFindComment = `SELECT id,text,owner_id,post_id FROM comment WHERE id = $1`;
		const findComment = db.query(queryForFindComment, [commentId]);

		new Promise((resolve) => resolve(findComment))
			.then((findComment) => res.status(200).json({ success: true, comment: findComment.rows[0] }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}
}

module.exports = new AdminController();