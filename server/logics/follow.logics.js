const db = require("../db");

class FollowLogics {
	checkFollow({ userId, followerId }) {
		const queryForFindFollow = `SELECT follower_id FROM follow WHERE user_id = $1`;
		const findFollow = db.query(queryForFindFollow, [userId]);

		let follow = false;

		return new Promise((resolve) => resolve(findFollow))
			.then((findFollow) => {
				if (!findFollow.rows[0]) {
					return { success: true, follow: false };
				};

				follow = +findFollow.rows[0].follower_id === +followerId;

				return { success: true, follow };
			})
			.catch((error) => {
				throw new Error(error.message || error);
			});
	}
}

module.exports = new FollowLogics();