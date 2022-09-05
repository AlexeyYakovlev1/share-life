const { existsSync, unlink } = require("fs");
const { relative } = require("path");

const { PROJECT_ROOT } = process.env;

class FilesController {
	remove(req, res) {
		if (!Object.entries(req.params).length || !req.params.filename || !req.params.folder) {
			return res.status(400).json({ success: false, message: "Check your params. Must be this: filename, folder (post or user)" });
		}

		const { filename, folder } = req.params;
		const fullPath = relative(PROJECT_ROOT, `./templates/${folder}/${filename}`);

		if (!existsSync(fullPath)) {
			return res.status(404).json({ success: false, message: `Image by path ${fullPath} not found` });
		}

		unlink(fullPath, (error) => {
			if (error) {
				return res.status(400).json({ success: false, message: error.message, error });
			}

			return res.status(200).json({ success: true, message: "Image has been removed" });
		});
	}
}

module.exports = new FilesController();