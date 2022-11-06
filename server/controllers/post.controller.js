const PostLogics = require("../logics/post.logics");
const { validationResult } = require("express-validator");

class PostController {
	create(req, res) {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ success: false, errors: errors.array() });
		}

		const { photos } = req.body;

		if (!photos.length) {
			return res.status(400).json({ success: false, message: "Upload some photos" });
		}

		PostLogics.create({ ...req.user, ...req.body })
			.then((data) => res.status(200).json({ ...data }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	remove(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Params must exist" });
		}

		const { id: idPost } = req.params;
		const { id: idCurrentUser } = req.user;

		PostLogics.remove({ idPost, idCurrentUser })
			.then((data) => res.status(200).json({ ...data }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	getAllByUserId(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Params must exist" });
		}

		PostLogics.getAllByUserId({ ...req.params })
			.then((data) => res.status(200).json({ ...data }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	getAll(req, res) {
		PostLogics.getAll(req.query)
			.then((data) => res.status(200).json({ ...data }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	getOne(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Params must exist" });
		}

		PostLogics.getOne(req.params)
			.then((data) => res.status(200).json({ ...data }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	update(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Params must exist" });
		}

		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ success: false, errors: errors.array() });
		}

		const payload = {
			idPost: req.params.id,
			idCurrentUser: req.user.id,
			...req.body
		};

		PostLogics.update(payload)
			.then((data) => res.status(200).json({ ...data }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	// ставим лайк
	like(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(404).json({ success: false, message: "Params must exist" });
		}

		const payload = {
			userId: req.user.id,
			postId: req.params.id,
			io: req.app.get("socketio")
		};

		PostLogics.like(payload)
			.then((data) => res.status(200).json({ ...data }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	// проверка переданного id пользователя на поставленный лайк на определенном посте
	putedLike(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(404).json({ success: false, message: "Params must exist" });
		}

		const { id: postId } = req.params;
		const { id: userId } = req.user;

		PostLogics.putedLike({ postId, userId })
			.then((data) => res.status(200).json({ ...data }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}
}

module.exports = new PostController();