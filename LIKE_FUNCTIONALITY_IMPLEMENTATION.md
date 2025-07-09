# Like Functionality Implementation

This document outlines the complete implementation of the like functionality for the SongBank application, following the recommended database design pattern.

## Database Design

### Schema Structure

The implementation follows the recommended many-to-many relationship pattern:

#### 1. Users Table (existing)

```javascript
// modules/user.js
{
  _id: ObjectId,        // Primary Key
  name: String,
  email: String,
  password: String,
  role: String,
  // ... other user fields
}
```

#### 2. Songs Table (existing)

```javascript
// modules/song.js
{
  _id: ObjectId,        // Primary Key
  title: String,
  slug: String,
  authorName: String,
  likesCount: Number,   // Denormalized count for performance
  // ... other song fields
}
```

#### 3. Likes Table (pivot table)

```javascript
// modules/like.js
{
  _id: ObjectId,        // Primary Key (auto-incrementing)
  user: ObjectId,       // Foreign Key -> users._id
  song: ObjectId,       // Foreign Key -> songs._id
  createdAt: Date       // Timestamp
}
```

### Key Features

1. **Unique Constraint**: Compound unique index on `{ user: 1, song: 1 }` prevents duplicate likes
2. **Timestamps**: `createdAt` field tracks when the like occurred
3. **Denormalized Count**: `likesCount` in songs table for performance
4. **Referential Integrity**: Foreign keys ensure data consistency

## API Endpoints

### Like Management

#### 1. Like a Song

```
POST /api/likes
x-auth-token: <token>
Content-Type: application/json

{
  "song": "songId"
}

Response:
{
  "message": "Song liked successfully",
  "like": {
    "_id": "likeId",
    "user": { "name": "User Name", "email": "user@example.com" },
    "song": { "title": "Song Title", "slug": "song-slug" },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2. Unlike a Song

```
DELETE /api/likes/:songId
x-auth-token: <token>

Response:
{
  "message": "Song unliked successfully",
  "songId": "songId"
}
```

#### 3. Check Like Status

```
GET /api/likes/:songId
x-auth-token: <token>

Response:
{
  "isLiked": true,
  "songId": "songId",
  "likesCount": 42
}
```

### User's Liked Songs

#### 4. Get User's Liked Songs

```
GET /api/likes/user/liked?page=1&limit=10
x-auth-token: <token>

Response:
{
  "songs": [
    {
      "_id": "songId",
      "title": "Song Title",
      "slug": "song-slug",
      "authorName": "Author Name",
      "likesCount": 42,
      "views": 1000,
      "language": { "name": "English", "code": "en" },
      "category": { "title": "Gospel" },
      "likedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "hasMore": true
  }
}
```

### Song Information

#### 5. Get Song with Like Status

```
GET /api/songs/:id/with-like-status
x-auth-token: <token>

Response:
{
  "_id": "songId",
  "title": "Song Title",
  "likesCount": 42,
  "isLiked": true,
  // ... all other song fields
}
```

#### 6. Get Song Like Count

```
GET /api/likes/song/:songId/count

Response:
{
  "songId": "songId",
  "likesCount": 42
}
```

## Implementation Details

### Database Operations

1. **Creating a Like**:

   - Check if song exists
   - Check if user already liked the song (prevent duplicates)
   - Create new like record
   - Update song's `likesCount`

2. **Removing a Like**:

   - Find and delete the like record
   - Update song's `likesCount`

3. **Checking Like Status**:
   - Query likes collection for user-song combination
   - Return boolean result

### Performance Optimizations

1. **Denormalized Count**: `likesCount` field in songs table avoids counting likes on every request
2. **Indexes**: Compound unique index on `{ user: 1, song: 1 }` for fast lookups
3. **Pagination**: Implemented for user's liked songs to handle large datasets
4. **Selective Population**: Only populate necessary fields to reduce response size

### Error Handling

- **404**: Song not found
- **400**: Invalid request data, duplicate like attempt
- **401**: Unauthorized (missing or invalid token)
- **500**: Server errors

### Security Features

1. **Authentication Required**: All like operations require valid JWT token
2. **User Isolation**: Users can only manage their own likes
3. **Input Validation**: All inputs validated using Joi schemas
4. **ObjectId Validation**: MongoDB ObjectId format validation

## Frontend Integration

### Example Usage

```javascript
// Like a song
const likeSong = async (songId) => {
  try {
    const response = await fetch("/api/likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify({ song: songId }),
    });
    const data = await response.json();
    // Update UI to show liked state
  } catch (error) {
    console.error("Error liking song:", error);
  }
};

// Unlike a song
const unlikeSong = async (songId) => {
  try {
    const response = await fetch(`/api/likes/${songId}`, {
      method: "DELETE",
      headers: {
        "x-auth-token": token,
      },
    });
    const data = await response.json();
    // Update UI to show unliked state
  } catch (error) {
    console.error("Error unliking song:", error);
  }
};

// Check if user liked a song
const checkLikeStatus = async (songId) => {
  try {
    const response = await fetch(`/api/likes/${songId}`, {
      headers: {
        "x-auth-token": token,
      },
    });
    const data = await response.json();
    return data.isLiked;
  } catch (error) {
    console.error("Error checking like status:", error);
    return false;
  }
};
```

## Database Migration

If you need to migrate existing data or add the like functionality to an existing database:

1. **Create the likes collection** (already implemented)
2. **Add indexes** (already implemented)
3. **Update existing songs** to have correct `likesCount` values
4. **Test the functionality** with sample data

## Testing

### Manual Testing Checklist

- [ ] Like a song (should succeed)
- [ ] Like the same song again (should fail with 400)
- [ ] Unlike a song (should succeed)
- [ ] Unlike a song that wasn't liked (should fail with 404)
- [ ] Check like status for liked song (should return true)
- [ ] Check like status for unliked song (should return false)
- [ ] Get user's liked songs (should return paginated list)
- [ ] Get song with like status (should include isLiked field)
- [ ] Get song like count (should return current count)

### API Testing with curl

```bash
# Like a song
curl -X POST http://localhost:3000/api/likes \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_TOKEN" \
  -d '{"song": "SONG_ID"}'

# Unlike a song
curl -X DELETE http://localhost:3000/api/likes/SONG_ID \
  -H "x-auth-token: YOUR_TOKEN"

# Check like status
curl http://localhost:3000/api/likes/SONG_ID \
  -H "x-auth-token: YOUR_TOKEN"

# Get user's liked songs
curl http://localhost:3000/api/likes/user/liked \
  -H "x-auth-token: YOUR_TOKEN"
```

## Conclusion

This implementation provides a robust, scalable like functionality that follows database best practices and provides a clean API for frontend integration. The design ensures data integrity, performance, and security while maintaining flexibility for future enhancements.
