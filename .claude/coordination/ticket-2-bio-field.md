# Ticket 2: Bio/Description Field Implementation

## Code Snippet

Add this route handler to `src/routes/profile.js`:

```javascript
/**
 * PUT /api/profile/:userId/bio
 * Update user bio/description
 */
router.put('/:userId/bio', (req, res) => {
  const { userId } = req.params;
  const { bio } = req.body;

  let user = users.get(userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Validate bio
  if (bio !== undefined) {
    if (typeof bio !== 'string') {
      return res.status(400).json({ error: 'Bio must be a string' });
    }

    const trimmedBio = bio.trim();

    if (trimmedBio.length > 500) {
      return res.status(400).json({ error: 'Bio must be 500 characters or less' });
    }

    // Basic sanitization - remove script tags
    const sanitizedBio = trimmedBio.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    user.bio = sanitizedBio;
    user.updatedAt = new Date();
  }

  res.json(user.toJSON());
});
```

## User Model Update

Add `bio` field to User model in `src/models/User.js`:

```javascript
class User {
  constructor(userId, email, name) {
    this.userId = userId;
    this.email = email;
    this.name = name;
    this.bio = ''; // ADD THIS LINE
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      userId: this.userId,
      email: this.email,
      name: this.name,
      bio: this.bio, // ADD THIS LINE
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
```

## Testing
```bash
curl -X PUT http://localhost:3000/api/profile/user123/bio \
  -H "Content-Type: application/json" \
  -d '{"bio": "Full-stack developer passionate about AI and distributed systems."}'
```
