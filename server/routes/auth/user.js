require('dotenv').config();
const express = require('express');
const User = require('../../models/user');
const authenticateToken = require('../../middlewares/user');
const router = express.Router();

router.get('/user', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;