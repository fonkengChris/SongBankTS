# Like Functionality Hooks

This directory contains consolidated hooks for managing song likes functionality. All hooks now use a single `likeService` for API calls, eliminating redundancy and ensuring consistency.

## Available Hooks

### `useLikeManager` (Recommended)

The main hook for managing like state and operations. Provides optimistic updates and comprehensive error handling.

```typescript
const {
  isLiked,
  likesCount,
  loading,
  error,
  likeSong,
  unlikeSong,
  toggleLike,
  refresh,
} = useLikeManager(songId);
```

**Features:**

- Optimistic UI updates
- Automatic error recovery
- Loading states
- Toggle functionality
- Refresh capability

### `useLikeStatus`

Simple hook to check if a song is liked by the current user.

```typescript
const { likeStatus, loading, error, refetch } = useLikeStatus(songId);
```

### `useLikedSongs`

Hook to fetch all songs liked by the current user with pagination.

```typescript
const { likedSongs, loading, error, refetch } = useLikedSongs(page, limit);
```

### `useSongWithLikeStatus`

Hook to fetch a song with its like status included.

```typescript
const { song, loading, error, refetch } = useSongWithLikeStatus(songId);
```

### `useLike` / `useUnlike`

Simple hooks for individual like/unlike operations.

```typescript
const { likeSong } = useLike();
const { unlikeSong } = useUnlike();

// Usage
const result = await likeSong(songId);
```

## Service Layer

All hooks use the `likeService` from `../services/like-service.ts` which provides:

- `likeSong(songId)`
- `unlikeSong(songId)`
- `getLikeStatus(songId)`
- `getLikeCount(songId)`
- `getLikedSongs(page, limit)`
- `getSongWithLikeStatus(songId)`

## Backend Integration

The hooks work with the following backend endpoints:

- `POST /api/likes` - Like a song
- `DELETE /api/likes/:songId` - Unlike a song
- `GET /api/likes/:songId` - Check like status
- `GET /api/likes/song/:songId/count` - Get like count
- `GET /api/likes/user/liked` - Get user's liked songs
- `GET /api/songs/:id/with-like-status` - Get song with like status

## Usage Example

```typescript
import useLikeManager from "../hooks/useLikeManager";

const SongComponent = ({ songId }) => {
  const { isLiked, likesCount, loading, error, toggleLike } =
    useLikeManager(songId);

  return (
    <div>
      <Like liked={isLiked} onLike={toggleLike} />
      <span>{likesCount} likes</span>
      {loading && <Spinner />}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
};
```
