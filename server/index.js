require("dotenv").config();

const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT || 5000;
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
	cors: {
		origin: "http://192.168.1.118:3000"
	}
})

app.set("socketio", io);

app.use(cors());
app.use(express.json({ extended: true, limit: "50mb" }));

app.use("/search", require("./routes/search.route"));
app.use("/auth", require("./routes/auth.route"));
app.use("/users", require("./routes/user.route"));
app.use("/posts", require("./routes/post.route"));
app.use("/comments", require("./routes/comment.route"));
app.use("/upload", require("./routes/upload.route"));
app.use("/files", require("./routes/files.route"));
app.use("/follow", require("./routes/follow.route"));
app.use("/access", require("./routes/access.route"));
app.use("/admin", require("./routes/admin.route"));

function run() {
	http.listen(PORT, () => {
		console.log(`Server has been started on port ${PORT}`);
	});
}

run();