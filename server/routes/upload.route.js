const router = require("express").Router();
const UploadController = require("../controllers/upload.controller");
const AuthMiddleware = require("../middlewares/authentication.middleware");
const uploadService = require("../services/upload.service");

router.post("/avatar",
	AuthMiddleware,
	uploadService("avatar", "single", "../templates/user"),
	UploadController.uploadAvatar
);

router.post("/photos",
	AuthMiddleware,
	uploadService("photos", "array", "../templates/post"),
	UploadController.uploadPhotos
);

module.exports = router;