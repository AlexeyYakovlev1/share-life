const router = require("express").Router();
const UploadController = require("../controllers/upload.controller");
const AuthMiddleware = require("../middlewares/authentication.middleware");
const uploadService = require("../services/upload.service");

router.get("/avatar",
	AuthMiddleware,
	uploadService("avatar", "single", "../templates/user"),
	UploadController.uploadAvatar
);

router.get("/photos",
	AuthMiddleware,
	uploadService("photos", "array", "../templates/post"),
	UploadController.uploadPhotos
);

module.exports = router;