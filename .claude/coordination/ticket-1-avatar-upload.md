# Ticket 1: Avatar Upload Implementation

## Code Snippet

Add this route handler to `src/routes/profile.js` after the existing PUT route:

```javascript
/**
 * POST /api/profile/:userId/avatar
 * Upload user avatar
 */
const multer = require('multer');
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, and WebP are allowed.'));
    }
  }
});

router.post('/:userId/avatar', upload.single('avatar'), (req, res) => {
  const { userId } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: 'No avatar file provided' });
  }

  let user = users.get(userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // In a real app, this would be uploaded to S3/CloudFront
  // For this mock, we'll just store a placeholder URL
  user.avatarUrl = `/uploads/avatars/${userId}_${Date.now()}.${req.file.mimetype.split('/')[1]}`;
  user.updatedAt = new Date();

  res.json(user.toJSON());
});
```

## User Model Update

Add `avatarUrl` field to User model in `src/models/User.js`:

```javascript
class User {
  constructor(userId, email, name) {
    this.userId = userId;
    this.email = email;
    this.name = name;
    this.avatarUrl = null; // ADD THIS LINE
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      userId: this.userId,
      email: this.email,
      name: this.name,
      avatarUrl: this.avatarUrl, // ADD THIS LINE
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
```

## Testing
```bash
curl -X POST http://localhost:3000/api/profile/user123/avatar \
  -F "avatar=@test-image.jpg"
```
