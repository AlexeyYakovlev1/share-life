const router = require("express").Router();
const AccessController = require("../controllers/access.controller");
const AuthMiddleware = require("../middlewares/authentication.middleware");
const RolesMiddleware = require("../middlewares/role.middleware");

// for example: /access/user/2
router.get("/user/:id", AuthMiddleware, AccessController.user);
// for example: /access/admin
router.get("/admin", RolesMiddleware(["ADMIN"]), AccessController.admin);

module.exports = router;