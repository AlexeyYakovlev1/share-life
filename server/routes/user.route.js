const router = require("express").Router();

const { body } = require("express-validator");
const UserController = require("../controllers/user.controller");
const RoleMiddleware = require("../middlewares/role.middleware");
const AuthMiddleware = require("../middlewares/authentication.middleware");

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
router.delete("/remove/:id", RoleMiddleware(["ADMIN"]), UserController.remove);
router.get("/all", UserController.getAll);
router.get("/:id", UserController.getOne);
router.put(
	"/update/:id",
	AuthMiddleware,
	UserController.update
);

module.exports = router;