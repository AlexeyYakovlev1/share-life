const router = require("express").Router();
const RoleMiddleware = require("../middlewares/role.middleware");
const AdminController = require("../controllers/admin.controller");

// for example: /admin/search/users?q=2, where q = user id
router.get("/search/users", RoleMiddleware(["ADMIN"]), AdminController.searchUsers);
// for example: /admin/search/posts?q=2, where q = user id
router.get("/search/posts", RoleMiddleware(["ADMIN"]), AdminController.searchPosts);
// for example: /admin/search/comments?q=2, where q = user id
router.get("/search/comments", RoleMiddleware(["ADMIN"]), AdminController.searchComments);

module.exports = router;