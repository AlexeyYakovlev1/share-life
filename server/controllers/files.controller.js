const { existsSync, unlink } = require("fs");
const { relative } = require("path");

const { PROJECT_ROOT } = process.env;

class FilesController {
	remove(req, res) {
		if (!Object.entries(req.params).length || !req.params.filename || !req.params.folder) {
			return res.status(400).json({
				success: false,
				message: "Проверьте ваши параметры. Должны быть: filename, folder (post или user)"
			});
		}

		const { filename, folder } = req.params;
		const fullPath = relative(PROJECT_ROOT, `./templates/${folder}/${filename}`);

		if (!existsSync(fullPath)) {
			return res.status(404).json({ success: false, message: `Фото по пути ${fullPath} не найдено` });
		}

		unlink(fullPath, (error) => {
			if (error) {
				return res.status(400).json({ success: false, message: error.message, error });
			}

			return res.status(200).json({ success: true, message: "Фото было удалено" });
		});
	}
}

module.exports = new FilesController();