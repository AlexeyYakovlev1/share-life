const db = require("../db");

class FollowController {
	checkFollow(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Params must exist" });
		}

		if (!req.user) return;

		const { id: userId } = req.params;
		const { id: followerId } = req.user;

		const queryForFindFollow = `SELECT follower_id FROM follow WHERE user_id = $1`;
		const findFollow = db.query(queryForFindFollow, [userId]);

		let follow = false;

		new Promise((resolve) => resolve(findFollow))
			.then((findFollow) => {
				if (!findFollow.rows[0]) {
					return res.status(200).json({ success: true, follow: false });
				};

				follow = +findFollow.rows[0].follower_id === +followerId;

				return res.status(200).json({ success: true, follow });
			})
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}
}

module.exports = new FollowController();