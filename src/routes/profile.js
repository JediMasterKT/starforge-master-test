const express = require('express');
const router = express.Router();
const User = require('../models/User');

// In-memory user storage (mock database)
const users = new Map();

/**
 * GET /api/profile/:userId
 * Get user profile by ID
 */
router.get('/:userId', (req, res) => {
  const { userId } = req.params;

  const user = users.get(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user.toJSON());
});

/**
 * PUT /api/profile/:userId
 * Update user profile
 */
router.put('/:userId', (req, res) => {
  const { userId } = req.params;
  const { email, name } = req.body;

  let user = users.get(userId);

  if (!user) {
    // Create new user if doesn't exist
    user = new User(userId, email, name);
    users.set(userId, user);
  } else {
    // Update existing user
    if (email) user.email = email;
    if (name) user.name = name;
    user.updatedAt = new Date();
  }

  res.json(user.toJSON());
});

module.exports = router;
