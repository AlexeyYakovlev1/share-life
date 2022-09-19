const router = require("express").Router();

const { body } = require("express-validator");
const UserController = require("../controllers/user.controller");
const RoleMiddleware = require("../middlewares/role.middleware");
const AuthMiddleware = require("../middlewares/authentication.middleware");

// for example: /users/add
router.post(
	"/add",
	[
		body("email").isEmail(),
		body("password").isLength({ min: 6 }),
		body("fullName").isLength({ min: 3 }),
		body("userName").isLength({ min: 3 })
	],
	RoleMiddleware(["ADMIN"]),
	UserController.create
);
// for example: /users/follow
router.get("/follow/:id", AuthMiddleware, UserController.follow);
// for example: /users/remove/2
router.delete("/remove/:id", RoleMiddleware(["ADMIN"]), UserController.remove);
// for example: /users/all
router.get("/all", UserController.getAll);
// for example: /users/2
router.get("/:id", UserController.getOne);
// for example: /users/update/2
router.put(
	"/update/:id",
	AuthMiddleware,
	UserController.update
);

module.exports = router;