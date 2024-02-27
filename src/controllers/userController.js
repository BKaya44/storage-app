const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Verification = require("../models/verification");

const SECRET_KEY = process.env.SECRET_KEY;

/**
 * POST /register
 * Registers a new user.
 *
 * Body parameters:
 * - email (string): The user's email address.
 * - password (string): The desired password.
 *
 * Responses:
 * - 200 Created: User successfully registered.
 * - 409 Conflict: User email already exists.
 * - 500 Internal Server Error: Something went wrong.
 */
const register = async (req, res, next) => {
  const { password, email } = req.body;
  if (
    typeof email === "undefined" ||
    typeof password === "undefined"
  ) {
    return res.status(400).json({ message: "Incorrect usage of API." });
  } else {
    if (password.length < 6 || email.length < 6) {
      return res.status(400).json({ message: "Incorrect usage of API." });
    }
  }

  try {
    const user = await User.create({
      email,
      password,
    });

    const verificationKey = crypto.randomBytes(16).toString("hex");
    await Verification.create({
      user_id: user.id,
      verification_text: verificationKey,
    });

    // await Mailer.sendVerificationEmail(email, verificationKey);

    return res.status(200).json({
      message: "User registered successfully"
    });
  } catch (error) {
    if (error instanceof Sequelize.UniqueConstraintError) {
      return res
        .status(409)
        .json({ message: "Email already exists" });
    } else {
      return res.status(500).json({ message: error.message });
    }
  }
};

/**
 * POST /verify
 * Verifies a user's email address using a verification key.
 *
 * Query:
 * - verification (string): The verification key sent to the user's email.
 *
 * Responses:
 * - 200 OK: User verified successfully.
 * - 400 Bad Request: Missing verification key.
 * - 404 Not Found: Invalid or expired verification key.
 * - 500 Internal Server Error: Something went wrong.
 */
const verify = async (req, res) => {
  const verificationKey = req.query["verification-key"];
  if (!verificationKey) {
    return res
      .status(400)
      .json({ message: "Incorrect verification." });
  }
  
  try {
    const verification = await Verification.findOne({
      where: { verification_text: verificationKey, active: true },
    });
    if (!verification) {
      return res
        .status(404)
        .json({ message: "Invalid or expired verification key" });
    }

    await User.update({ verified: true }, { where: { id: verification.user_id } });
    await Verification.update(
      { active: false },
      { where: { id: verification.id } }
    );

    return res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * POST /login
 * Authenticates a user and returns a JWT token.
 *
 * Body parameters:
 * - email (string): The user email.
 * - password (string): The password.
 *
 * Responses:
 * - 200 OK: Successful login, returns JWT token.
 * - 401 Unauthorized: Invalid email or password.
 * - 500 Internal Server Error: Something went wrong.
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      SECRET_KEY,
      { expiresIn: "30d" }
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { register, verify, login };
