const AdminLogics = require("../logics/admin.logics");

class AdminController {
	searchUsers(req, res) {
		if (!Object.entries(req.query).length || !req.query.q) {
			return res.status(400).json({ success: false, message: "Query `q` must be" });
		}

		const { q: userId } = req.query;

		AdminLogics.searchUsers({ userId })
			.then((data) => res.status(200).json({ ...data }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	searchPosts(req, res) {
		if (!Object.entries(req.query).length || !req.query.q) {
			return res.status(400).json({ success: false, message: "Query `q` must be" });
		}

		const { q: postId } = req.query;

		AdminLogics.searchPosts({ postId })
			.then((data) => res.status(200).json({ ...data }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	searchComments(req, res) {
		if (!Object.entries(req.query).length || !req.query.q) {
			return res.status(400).json({ success: false, message: "Query `q` must be exist" });
		}

		const { q: commentId } = req.query;

		AdminLogics.searchComments({ commentId })
			.then((data) => res.status(200).json({ ...data }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	removeUser(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Params must be exist" });
		}

		const { id: userId } = req.params;

		AdminLogics.removeUser({ userId })
			.then((data) => res.status(200).json({ ...data }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	removePost(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Params must exist" });
		}

		const { id: idPost } = req.params;

		AdminLogics.removePost({ idPost })
			.then((data) => res.status(200).json({ ...data }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	removeComment(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Params has been exist" });
		}

		const { id: commentId } = req.params;

		AdminLogics.removeComment({ commentId })
			.then((data) => res.status(200).json({ ...data }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	changeUser(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Params must be exist" });
		}

		const payload = {
			changeUserId: req.params.id,
			...req.body
		};

		AdminLogics.changeUser(payload)
			.then((data) => res.status(200).json({ ...data }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}
}

module.exports = new AdminController();