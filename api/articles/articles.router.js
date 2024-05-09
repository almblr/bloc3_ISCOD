const express = require("express");
const articleController = require("./articles.controller");
const authMiddleware = require("../../middlewares/auth");
const router = express.Router();

router.post("/", authMiddleware, articleController.create);
router.put("/:id", authMiddleware, articleController.update);
router.delete("/:id", authMiddleware, articleController.delete);

module.exports = router;
