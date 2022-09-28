const router = require("express").Router();
const AccessController = require("../controllers/access.controller");
const AuthMiddleware = require("../middlewares/authentication.middleware");

// for example: /access/user/2
router.get("/user/:id", AuthMiddleware, AccessController.user);

module.exports = router;