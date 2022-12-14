const toBase64 = require("../utils/toBase64.util");
const db = require("../db");

const path = require("path");
const fs = require("fs");

const { PROJECT_ROOT } = process.env;

class UploadController {
	uploadAvatar(req, res) {
		const { file } = req;

		if (!file) {
			return res.status(400).json({ success: false, message: "File is not found" });
		}

		const { id: currentIdUser, roles } = req.user;
		const { id: idFromQuery } = req.query;

		const pathToFile = path.relative(PROJECT_ROOT, `./templates/user/${file.filename}`);
		const dataFile = {
			filename: file.filename,
			inBase64: toBase64(pathToFile)
		};

		const updateUser = req.query["update-user"] === "true";
		const adminUpdate = req.query.id !== "-1" && roles.includes("ADMIN");

		// update user avatar if query update-user exist
		if (req.query && updateUser) {
			const queryForFindOldAvatar = `SELECT avatar FROM person WHERE id = $1`;
			const findOldAvatar = db.query(queryForFindOldAvatar, [!adminUpdate ? currentIdUser : idFromQuery]);

			return new Promise((resolve) => resolve(findOldAvatar))
				.then((person) => {
					if (person.rows[0].avatar) {
						const filePath = path.relative(PROJECT_ROOT, `./templates/user/${person.rows[0].avatar}`);

						fs.unlink(filePath, (err) => {
							if (err) return Promise.reject(err);
						});
					}

					const queryForUpdateUser = `UPDATE person SET avatar = $1 WHERE id = $2`;
					const updateUser = db.query(queryForUpdateUser, [
						file.filename, !adminUpdate ? currentIdUser : idFromQuery
					]);

					return Promise.resolve(updateUser);
				})
				.then(() => res.status(200).json({ success: true, message: "Avatar has been uploaded", dataFile }))
				.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
		}

		return res.status(200).json({ success: true, message: "File has been uploaded", dataFile });
	}

	uploadPhotos(req, res) {
		const { files } = req;

		if (!files.length) {
			return res.status(400).json({ success: false, message: "Photos is not found" });
		}

		const fileNames = files.map(file => file.filename);

		return res.status(200).json({ success: true, message: "Photos has been uploaded", fileNames });
	}
}

module.exports = new UploadController();