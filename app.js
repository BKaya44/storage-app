const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const User = require('./models/User');
const Verification = require('./models/Verification');
const Mailer = require('./Mailer');
const { encrypt, decrypt } = require('./Crypto');

const app = express();

app.use(cors());
app.use(bodyParser.json());

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
 * - 201 Created: User successfully registered.
 * - 409 Conflict: Username or email already exists.
 * - 500 Internal Server Error: Something went wrong.
 */
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await User.create({ username, password: hashedPassword, email });
        
        const verificationKey = crypto.randomBytes(10).toString('hex');
        await Verification.create({ user_id: user.id, text: verificationKey });

        await Mailer.sendVerificationEmail(email, verificationKey);

        const encryptedUserId = encrypt(user.id.toString());

        res.status(201).json({ message: "User registered successfully", userId: encryptedUserId });
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(409).json({ message: "Username or email already exists" });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

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
app.post('/verify', async (req, res) => {
    const encryptedUserId = req.headers['user-id'];
    const verificationKey = req.headers['verification-key'];
    if (!encryptedUserId || !verificationKey) {
        return res.status(400).json({ message: "Missing user ID or verification key in headers" });
    }

    const userId = decrypt(encryptedUserId);

    try {
        const verification = await Verification.findOne({ where: { user_id: userId, text: verificationKey, active: true } });
        if (!verification) {
            return res.status(404).json({ message: "Invalid or expired verification key" });
        }

        await User.update({ verified: true }, { where: { id: userId } });
        await Verification.update({ active: false }, { where: { id: verification.id } });

        res.status(200).json({ message: "User verified successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
            },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});


app.listen(3000, () => console.log('Server started on port 3000'));
