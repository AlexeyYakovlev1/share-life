const router = require("express").Router();
const RoleMiddleware = require("../middlewares/role.middleware");
const AdminController = require("../controllers/admin.controller");

// for example: /admin/search/users?q=2, where q = user id
router.get("/search/users", RoleMiddleware(["ADMIN"]), AdminController.searchUsers);
// for example: /admin/search/posts?q=2, where q = user id
router.get("/search/posts", RoleMiddleware(["ADMIN"]), AdminController.searchPosts);
// for example: /admin/search/comments?q=2, where q = user id
router.get("/search/comments", RoleMiddleware(["ADMIN"]), AdminController.searchComments);

// for example: /admin/remove/user/3
router.delete("/remove/user/:id", RoleMiddleware(["ADMIN"]), AdminController.removeUser);
// for example: /admin/remove/post/3
router.delete("/remove/post/:id", RoleMiddleware(["ADMIN"]), AdminController.removePost);
// for example: /admin/remove/comment/3
router.delete("/remove/comment/:id", RoleMiddleware(["ADMIN"]), AdminController.removeComment);

// for example: /admin/change/user/3
router.put("/change/user/:id", RoleMiddleware(["ADMIN"]), AdminController.changeUser);

module.exports = router;