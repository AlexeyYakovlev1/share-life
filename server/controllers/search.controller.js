const SearchLogics = require("../logics/search.logics");

class SearchController {
	search(req, res) {
		SearchLogics.search(req.query.q)
			.then((data) => res.status(200).json({ ...data }))
			.catch((err) => res.status(400).json({ success: false, err: err, message: err.message }));
	};
}

module.exports = new SearchController();