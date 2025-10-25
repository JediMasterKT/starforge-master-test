# Ticket 4: Privacy Controls Implementation

## Code Snippet

Add this route handler to `src/routes/profile.js`:

```javascript
/**
 * PUT /api/profile/:userId/privacy
 * Update user privacy settings
 */
router.put('/:userId/privacy', (req, res) => {
  const { userId } = req.params;
  const { privacy } = req.body;

  let user = users.get(userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Validate privacy setting
  const validPrivacyLevels = ['public', 'private', 'friends-only'];

  if (privacy !== undefined) {
    if (!validPrivacyLevels.includes(privacy)) {
      return res.status(400).json({
        error: 'Invalid privacy level. Must be: public, private, or friends-only'
      });
    }

    user.privacy = privacy;
    user.updatedAt = new Date();
  }

  res.json(user.toJSON());
});
```

## User Model Update

Add `privacy` field to User model in `src/models/User.js`:

```javascript
class User {
  constructor(userId, email, name) {
    this.userId = userId;
    this.email = email;
    this.name = name;
    this.privacy = 'public'; // ADD THIS LINE - default to public
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      userId: this.userId,
      email: this.email,
      name: this.name,
      privacy: this.privacy, // ADD THIS LINE
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
```

## Testing
```bash
# Test setting privacy to private
curl -X PUT http://localhost:3000/api/profile/user123/privacy \
  -H "Content-Type: application/json" \
  -d '{"privacy": "private"}'

# Test setting privacy to friends-only
curl -X PUT http://localhost:3000/api/profile/user123/privacy \
  -H "Content-Type: application/json" \
  -d '{"privacy": "friends-only"}'

# Test invalid privacy level (should fail)
curl -X PUT http://localhost:3000/api/profile/user123/privacy \
  -H "Content-Type: application/json" \
  -d '{"privacy": "invalid"}'
```
