const express = require("express");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json({ extended: true, limit: "50mb" }));

function run() {
	app.listen(PORT, () => {
		console.log(`Server has been started on port ${PORT}`);
	});
}

run();