const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate")

const storageItemController = require("../controllers/storageItemController");

router.post("/:id", authenticate, storageItemController.createItemStorage);
router.get("/:id", authenticate, storageItemController.viewItem);
router.get("/storage/:id", authenticate, storageItemController.viewStorageItems);

module.exports = router;
