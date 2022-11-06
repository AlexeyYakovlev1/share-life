const FollowLogics = require("../logics/follow.logics");

class FollowController {
	checkFollow(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Params must exist" });
		}

		if (!req.user) return;

		const { id: userId } = req.params;
		const { id: followerId } = req.user;

		FollowLogics.checkFollow({ userId, followerId })
			.then((data) => res.status(200).json({ ...data }))
			.catch((err) => res.status(400).json({ message: err.message, err: err }));
	}
}

module.exports = new FollowController();