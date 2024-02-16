const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate")

const storageController = require("../controllers/storageController");

router.post("/", authenticate, storageController.createStorage);
router.get("/", authenticate, storageController.viewAllStorage);
router.put("/:id", authenticate, storageController.editStorage);
router.get("/:id", authenticate, storageController.viewStorage);

module.exports = router;
