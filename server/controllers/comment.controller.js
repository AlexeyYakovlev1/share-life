const { validationResult } = require("express-validator");
const CommentLogics = require("../logics/comment.logics");

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

		const payload = {
			idPost: req.params.id,
			idCurrentUser: req.user.id,
			io: req.app.get("socketio"),
			...req.body
		};

		CommentLogics.create(payload)
			.then((data) => res.status(200).json({ ...data }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	remove(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Params must exist" });
		}

		const payload = {
			idCurrentUser: req.user.id,
			idComment: req.params.id
		}

		CommentLogics.remove(payload)
			.then((data) => res.status(200).json({ ...data }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	getAllByPostId(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Params must exist" });
		}

		const { id: idPost } = req.params;

		CommentLogics.getAllByPostId({ idPost })
			.then((data) => res.status(200).json({ ...data }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	getAll(req, res) {
		CommentLogics.getAll()
			.then((data) => res.status(200).json({ ...data }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}
}

module.exports = new CommentController();