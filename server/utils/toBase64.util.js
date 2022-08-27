const { readFileSync, existsSync } = require("fs");
const { extname } = require("path");

function toBase64(filePath) {
	if (!existsSync(filePath)) {
		return filePath.replace("..\\templates\\user\\", ""); // fix this later :)
	}

	const base64 = readFileSync(filePath, "base64");
	const extnameCurrentFile = extname(filePath).replace(".", "");
	const result = `data:image/${extnameCurrentFile};base64,${base64}`;

	return result;
}

module.exports = toBase64;