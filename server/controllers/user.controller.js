const UserLogics = require("../logics/user.logics");
const { validationResult } = require("express-validator");

class UserController {
	create(req, res) {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ success: false, errors: errors.array() });
		}

		const { roles } = req.body;

		if (!roles) return res.status(400).json({ success: false, message: "Роли не найдены" });

		UserLogics.create(req.body)
			.then((data) => res.status(200).json({ ...data }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	remove(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Параметры должны быть переданы" });
		}

		UserLogics.remove(req.params)
			.then((data) => res.status(200).json({ ...data }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	getAll(req, res) {
		UserLogics.getAll()
			.then((data) => res.status(200).json({ ...data }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	getOne(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Параметры должны быть переданы" });
		}

		UserLogics.getOne(req.params)
			.then((data) => res.status(200).json({ ...data }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	update(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Параметры должны быть переданы" });
		}

		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ success: false, errors: errors.array() });
		}

		UserLogics.update({ ...req.params, ...req.body })
			.then((data) => res.status(200).json({ ...data }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	follow(req, res) {
		const { id: followerId } = req.user;
		const { id: followingId } = req.params;

		UserLogics.follow({ followerId, followingId, io: req.app.get("socketio") })
			.then((data) => res.status(200).json({ ...data }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	getFollowersAndFollowings(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Параметры должны быть переданы" });
		}

		const { id: userId } = req.params;
		UserLogics.getFollowersAndFollowings({ userId })
			.then((data) => res.status(200).json({ ...data }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}
}

module.exports = new UserController();