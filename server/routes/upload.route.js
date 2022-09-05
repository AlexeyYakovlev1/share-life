const router = require("express").Router();
const UploadController = require("../controllers/upload.controller");
const AuthMiddleware = require("../middlewares/authentication.middleware");
const uploadService = require("../services/upload.service");

// for example: /upload/avatar
router.post("/avatar",
	AuthMiddleware,
	uploadService("avatar", "single", "../templates/user"),
	UploadController.uploadAvatar
);

// for example: /upload/photos
router.post("/photos",
	AuthMiddleware,
	uploadService("photos", "array", "../templates/post"),
	UploadController.uploadPhotos
);

module.exports = router;