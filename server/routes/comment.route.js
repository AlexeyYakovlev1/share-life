const router = require("express").Router();
const AuthMiddleware = require("../middlewares/authentication.middleware");
const CommentController = require("../controllers/comment.controller.js");
const RoleMiddleware = require("../middlewares/role.middleware");

// for example: /comments/add/3
router.post("/add/:id", AuthMiddleware, CommentController.create);
// for example: /comments/remove/3
router.delete("/remove/:id", AuthMiddleware, CommentController.remove);
// for example: /comments/all-by-post/2
router.get("/all-by-post/:id", CommentController.getAllByPostId);
// for example: /comments/all
router.get("/all", RoleMiddleware(["ADMIN"]), CommentController.getAll);

module.exports = router;