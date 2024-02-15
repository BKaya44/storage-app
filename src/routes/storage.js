const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate")

const storageController = require("../controllers/storageController");

router.post("/", authenticate, storageController.createStorage);
router.put("/:id", authenticate, storageController.editStorage);

module.exports = router;
