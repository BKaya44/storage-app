const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const userController = require("../controllers/userController");

function authenticate(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid authentication token" });
  }
}

router.post("/register", userController.register);
router.post("/verify", userController.verify);
router.post("/login", userController.login);

module.exports = router;
