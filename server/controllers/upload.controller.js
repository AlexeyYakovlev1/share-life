const toBase64 = require("../utils/toBase64.util");

const path = require("path");

const { PROJECT_ROOT } = process.env;

class UploadController {
	uploadAvatar(req, res) {
		const { file } = req;

		if (!file) {
			return res.status(400).json({ success: false, message: "Avatar is not found" });
		}

		const pathToFile = path.relative(PROJECT_ROOT, `./templates/user/${file.filename}`);
		const dataFile = {
			filename: file.filename,
			inBase64: toBase64(pathToFile)
		};

		return res.status(200).json({ success: true, message: "Avatar has been uploaded", dataFile });
	}

	uploadPhotos(req, res) {
		const { files } = req;

		if (!files.length) {
			return res.status(400).json({ success: false, message: "Photos is not found" });
		}

		const fileNames = files.map(file => file.filename);

		return res.status(200).json({ success: true, message: "Avatar has been uploaded", filenames: fileNames });
	}
}

module.exports = new UploadController();