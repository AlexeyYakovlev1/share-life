const multer = require("multer");
const path = require("path");

module.exports = function (namePhoto, type, directory) {
	const allowedTypes = ["single", "array"];

	if (!allowedTypes.includes(type)) {
		throw new Error(`Type ${type} not support. See this types: ${allowedTypes.join(", ")}`);
	}

	const storage = multer.diskStorage({
		destination(req, file, cb) {
			cb(null, directory);
		},
		filename(req, file, cb) {
			cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
		}
	});

	const image = multer({ storage, limits: { fieldSize: 25 * 1024 * 1024 } });

	let photo = null;

	switch (type) {
		case "single":
			photo = image.single(namePhoto);
			break;
		case "array":
			photo = image.array(namePhoto);
			break;
		default:
			return;
	}

	return photo;
}