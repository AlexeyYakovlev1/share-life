const router = require("express").Router();
const AuthMiddleware = require("../middlewares/authentication.middleware");
const CommentController = require("../controllers/comment.controller.js");

router.post("/add/:id", AuthMiddleware, CommentController.create);
router.delete("/remove/:id", AuthMiddleware, CommentController.remove);
router.get("/all-by-post/:id", AuthMiddleware, CommentController.getAllByPostId);

module.exports = router;