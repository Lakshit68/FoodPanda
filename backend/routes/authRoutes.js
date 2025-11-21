const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../src/models/User');

const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google-login', async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        let user = await User.findOne({ googleId: payload.sub });

        if (!user) {
            user = await User.findOne({ email: payload.email });
            if (user) {
                user.googleId = payload.sub;
                await user.save();
            } else {
                user = await User.create({
                    googleId: payload.sub,
                    fullName: payload.name,
                    email: payload.email,
                });
            }
        }

        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        const isProd = process.env.NODE_ENV === 'production';
        res.cookie('token', jwtToken, { httpOnly: true, sameSite: isProd ? 'none' : 'lax', secure: isProd, path: '/' });
        res.json({ message: 'Logged in with Google', user: { _id: user._id, fullName: user.fullName, email: user.email, isPremium: user.isPremium } });
    } catch (error) {
        console.error('Google authentication error:', {
            message: error.message,
            stack: error.stack,
        });
        res.status(401).json({ error: 'Invalid Google token' });
    }
});

module.exports = router;
