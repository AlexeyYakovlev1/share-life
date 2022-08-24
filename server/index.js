require("dotenv").config();

const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json({ extended: true, limit: "50mb" }));
app.use(express.static("../templates"));
app.use("/user", express.static("user"));
app.use("/post", express.static("post"));

app.use("/auth", require("./routes/auth.route"));
app.use("/users", require("./routes/user.route"));
app.use("/posts", require("./routes/post.route"));
app.use("/comments", require("./routes/comment.route"));
app.use("/upload", require("./routes/upload.route"));

function run() {
	app.listen(PORT, () => {
		console.log(`Server has been started on port ${PORT}`);
	});
}

run();