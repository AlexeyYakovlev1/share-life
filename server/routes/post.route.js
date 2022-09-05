const router = require("express").Router();
const PostController = require("../controllers/post.controller");
const AuthMiddleware = require("../middlewares/authentication.middleware");
const { body } = require("express-validator");

// for example: /posts/add
router.post(
	"/add",
	[
		body("description").isLength({ min: 0, max: 2200 }),
		body("location").isLength({ min: 3 })
	],
	AuthMiddleware,
	PostController.create
);

// for example: /posts/remove/3
router.delete("/remove/:id", AuthMiddleware, PostController.remove);
// for example: /posts/all-by-user/2
router.get("/all-by-user/:id", PostController.getAllByUserId);
// for example: /posts/all
router.get("/all", PostController.getAll);
// for example: /posts/3
router.get("/:id", PostController.getOne);
// for example: /posts/update/3
router.put("/update/:id", AuthMiddleware, PostController.update);

module.exports = router;