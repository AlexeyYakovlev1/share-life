const router = require("express").Router();
const FollowerMiddleware = require("../controllers/follow.controller");
const AuthMiddleware = require("../middlewares/authentication.middleware");

// for example: /follow/check/2
router.get("/check/:id", AuthMiddleware, FollowerMiddleware.checkFollow);

module.exports = router;