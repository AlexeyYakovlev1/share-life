const { readFileSync, existsSync } = require("fs");

function toBase64(filePath) {
	if (!existsSync(filePath)) return filePath.replace("..\\templates\\user\\", ""); // fix this later :)

	return readFileSync(filePath, "base64");
}

module.exports = toBase64;