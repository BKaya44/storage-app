const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");
const crypto = require("crypto");
const User = require("../models/user");
const Verification = require("../models/verification");
const { encrypt, decrypt } = require("../middleware/cryptoMiddleware");

const SECRET_KEY = process.env.SECRET_KEY;

/**
 * POST /register
 * Registers a new user.
 *
 * Body parameters:
 * - username (string): The desired username.
 * - password (string): The desired password.
 * - email (string): The user's email address.
 *
 * Responses:
 * - 200 Created: User successfully registered.
 * - 409 Conflict: Username or email already exists.
 * - 500 Internal Server Error: Something went wrong.
 */
const register = async (req, res, next) => {
  const { username, password, email } = req.body;

  if (!/^[A-Za-z0-9]*$/.test(username)) {
    return res
      .status(409)
      .json({ message: "Username can only contain letters and numbers." });
  }

  try {
    const user = await User.create({
      username,
      password,
      email,
    });

    const verificationKey = crypto.randomBytes(16).toString("hex");
    await Verification.create({
      user_id: user.id,
      verification_text: verificationKey,
    });

    // await Mailer.sendVerificationEmail(email, verificationKey);

    const encryptedUserId = encrypt(user.id.toString());

    return res.status(200).json({
      message: "User registered successfully",
      userId: encryptedUserId,
    });
  } catch (error) {
    if (error instanceof Sequelize.UniqueConstraintError) {
      return res
        .status(409)
        .json({ message: "Username or email already exists" });
    } else {
      return res.status(500).json({ message: error.message });
    }
  }
};

/**
 * POST /verify
 * Verifies a user's email address using a verification key.
 *
 * Headers:
 * - user-id (string): The encrypted user ID.
 * - verification-key (string): The verification key sent to the user's email.
 *
 * Responses:
 * - 200 OK: User verified successfully.
 * - 400 Bad Request: Missing user ID or verification key in headers.
 * - 404 Not Found: Invalid or expired verification key.
 * - 500 Internal Server Error: Something went wrong.
 */
const verify = async (req, res) => {
  const encryptedUserId = req.headers["user-id"];
  const verificationKey = req.headers["verification-key"];
  if (!encryptedUserId || !verificationKey) {
    return res
      .status(400)
      .json({ message: "Missing user ID or verification key in headers" });
  }

  const userId = decrypt(encryptedUserId);

  try {
    const verification = await Verification.findOne({
      where: { user_id: userId, text: verificationKey, active: true },
    });
    if (!verification) {
      return res
        .status(404)
        .json({ message: "Invalid or expired verification key" });
    }

    await User.update({ verified: true }, { where: { id: userId } });
    await Verification.update(
      { active: false },
      { where: { id: verification.id } }
    );

    res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /login
 * Authenticates a user and returns a JWT token.
 *
 * Body parameters:
 * - username (string): The username.
 * - password (string): The password.
 *
 * Responses:
 * - 200 OK: Successful login, returns JWT token.
 * - 401 Unauthorized: Invalid username or password.
 * - 500 Internal Server Error: Something went wrong.
 */
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { register, verify, login };
