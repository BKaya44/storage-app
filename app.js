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

app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword, email });

		const verificationKey = crypto.randomBytes(10).toString('hex');
		await Verification.create({ user_id: user.id, text: verificationKey });

		await Mailer.sendVerificationEmail(email, verificationKey);

		const encryptedUserId = encrypt(user.id.toString());

		res.status(201).json({ message: "User registered successfully", userId: encryptedUserId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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


app.listen(3000, () => console.log('Server started on port 3000'));
