const router = require("express").Router();
const AuthController = require("../controllers/auth.controller");
const { body } = require("express-validator");
const AuthMiddleware = require("../middlewares/authentication.middleware");

// for example: /auth/login
router.post(
	"/login",
	[
		body("email").isEmail(),
		body("password").isLength({ min: 6 })
	],
	AuthController.login
);

// for example: /auth/register
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

// for example: /auth/check
router.get(
	"/check",
	AuthMiddleware,
	AuthController.checkAuth
);

module.exports = router;