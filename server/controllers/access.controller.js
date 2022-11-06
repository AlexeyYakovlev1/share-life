const AccessLogics = require("../logics/access.logics");

class AccessController {
	user(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Params must exist" });
		}

		const { id: currentIdUser } = req.params;
		const { id: pageIdUser } = req.user;

		AccessLogics.user({ currentIdUser, pageIdUser })
			.then((data) => res.status(200).json({ ...data }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	admin(req, res) {
		AccessLogics.admin(req.user)
			.then((data) => res.status(200).json({ ...data }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}
}

module.exports = new AccessController();