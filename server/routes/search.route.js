const router = require("express").Router();
const SearchController = require("../controllers/search.controller");

router.get("/", SearchController.search)

module.exports = router;