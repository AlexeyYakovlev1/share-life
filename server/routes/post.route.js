const router = require("express").Router();
const PostController = require("../controllers/post.controller");
const AuthMiddleware = require("../middlewares/authentication.middleware");
const { body } = require("express-validator");

router.post(
	"/add",
	[
		body("description").isLength({ min: 0, max: 2200 }),
		body("location").isLength({ min: 3 })
	],
	AuthMiddleware,
	PostController.create
);

router.delete("/remove/:id", AuthMiddleware, PostController.remove);
router.get("/all-by-user/:id", PostController.getAllByUserId);
router.get("/all", PostController.getAll);
router.get("/:id", PostController.getOne);
router.put("/update/:id", AuthMiddleware, PostController.update);

module.exports = router;