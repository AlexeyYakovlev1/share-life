require("dotenv").config();

const express = require("express");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json({ extended: true, limit: "50mb" }));

app.use("/auth", require("./routes/auth.route"));
app.use("/users", require("./routes/user.route"));
app.use("/posts", require("./routes/post.route"));

function run() {
	app.listen(PORT, () => {
		console.log(`Server has been started on port ${PORT}`);
	});
}

run();