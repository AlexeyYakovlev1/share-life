const router = require("express").Router();
const FilesController = require("../controllers/files.controller.js");
const AuthMiddleware = require("../middlewares/authentication.middleware");

// for example: /files/remove/photos-1662022653528.png/post
router.delete("/remove/:filename/:folder", AuthMiddleware, FilesController.remove);

module.exports = router;