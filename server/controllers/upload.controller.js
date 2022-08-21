class UploadController {
	uploadAvatar(req, res) {
		const { file } = req;

		if (!file) {
			return res.status(400).json({ success: false, message: "Avatar is not found" });
		}

		return res.status(200).json({ success: true, message: "Avatar has been uploaded", filename: file.filename });
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