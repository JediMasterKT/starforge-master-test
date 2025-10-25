# Ticket 3: Social Links Implementation

## Code Snippet

Add this route handler to `src/routes/profile.js`:

```javascript
/**
 * PUT /api/profile/:userId/social-links
 * Update user social media links
 */
router.put('/:userId/social-links', (req, res) => {
  const { userId } = req.params;
  const { twitter, linkedin, github } = req.body;

  let user = users.get(userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // URL validation helper
  const isValidUrl = (url) => {
    if (!url || url === '') return true; // Empty is OK for removal
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Validate and update social links
  const socialLinks = {};

  if (twitter !== undefined) {
    if (!isValidUrl(twitter)) {
      return res.status(400).json({ error: 'Invalid Twitter URL' });
    }
    socialLinks.twitter = twitter;
  }

  if (linkedin !== undefined) {
    if (!isValidUrl(linkedin)) {
      return res.status(400).json({ error: 'Invalid LinkedIn URL' });
    }
    socialLinks.linkedin = linkedin;
  }

  if (github !== undefined) {
    if (!isValidUrl(github)) {
      return res.status(400).json({ error: 'Invalid GitHub URL' });
    }
    socialLinks.github = github;
  }

  user.socialLinks = { ...user.socialLinks, ...socialLinks };
  user.updatedAt = new Date();

  res.json(user.toJSON());
});
```

## User Model Update

Add `socialLinks` field to User model in `src/models/User.js`:

```javascript
class User {
  constructor(userId, email, name) {
    this.userId = userId;
    this.email = email;
    this.name = name;
    this.socialLinks = { twitter: '', linkedin: '', github: '' }; // ADD THIS LINE
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      userId: this.userId,
      email: this.email,
      name: this.name,
      socialLinks: this.socialLinks, // ADD THIS LINE
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
```

## Testing
```bash
curl -X PUT http://localhost:3000/api/profile/user123/social-links \
  -H "Content-Type: application/json" \
  -d '{
    "twitter": "https://twitter.com/johndoe",
    "linkedin": "https://linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe"
  }'
```
