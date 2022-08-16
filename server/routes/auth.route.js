const router = require("express").Router();
const AuthController = require("../controllers/auth.controller");
const { body } = require("express-validator");
const AuthMiddleware = require("../middlewares/authentication.middleware");

// login
router.post(
	"/login",
	[
		body("email").isEmail(),
		body("password").isLength({ min: 6 })
	],
	AuthController.login
);

// registration
router.post(
	"/register",
	[
		body("email").isEmail(),
		body("password").isLength({ min: 6 }),
		body("fullName").isLength({ min: 3 }),
		body("userName").isLength({ min: 3 })
	],
	AuthController.register
);

// check authentication
router.get(
	"/check",
	AuthMiddleware,
	AuthController.checkAuth
);

module.exports = router;