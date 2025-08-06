# View Tracking Optimization

## Problem

The previous view tracking implementation had several issues:

1. **Excessive Network Requests**: The `useTrackView` hook was sending POST requests every time a user visited a song detail page, even if they had already viewed it in the same session.

2. **Media Files Endpoint Issues**: The media files endpoint was automatically incrementing views and updating metacritic scores, causing 500 errors and unnecessary database operations.

3. **Resource Waste**: Multiple requests for the same song in a single session were wasting network resources and server processing power.

## Solution

### 1. Session-Based View Deduplication

**New Implementation:**
- Uses `localStorage` to track viewed songs within a session
- Only sends one view tracking request per song per session (24 hours)
- Automatically expires after 24 hours to allow fresh tracking

**Key Files:**
- `src/utils/view-tracking.ts` - Core utilities for managing viewed songs
- `src/hooks/useTrackView.ts` - Enhanced hook with deduplication
- `src/pages/SongDetailPage.tsx` - Updated to use enhanced tracking

### 2. Optimized Backend Endpoints

**Media Files Endpoint:**
- Removed automatic view tracking from `/api/media_files/:id`
- Now only serves media file data without side effects
- Prevents 500 errors and unnecessary database operations

**Songs View Endpoint:**
- Enhanced `/api/songs/:id/view` with better error handling
- Returns structured JSON responses
- Optimized for minimal network overhead

### 3. Session Management

**Features:**
- **Automatic Expiry**: Viewed songs list expires after 24 hours
- **Logout Cleanup**: Clears viewed songs when user logs out
- **Error Handling**: Graceful fallback if localStorage is unavailable
- **Initialization**: Checks for expired sessions on app startup

## Implementation Details

### View Tracking Flow

1. **User visits song detail page**
2. **Check if song already viewed in session**
3. **If not viewed:**
   - Send POST request to `/api/songs/:id/view`
   - On success, add song to viewed list
   - On error, log error but don't block UI
4. **If already viewed:**
   - Skip network request entirely
   - Continue with normal page rendering

### Session Management

```typescript
// Initialize on app startup
initializeViewTracking();

// Check if song viewed
if (!hasViewedSong(songId)) {
  // Track view
  trackViewOnce(songId);
}

// Clear on logout
clearViewedSongs();
```

### Backend Changes

**Before:**
```javascript
// Media files endpoint automatically tracked views
if (mediaFile.song) {
  const song = await Song.findByIdAndUpdate(mediaFile.song._id, {
    $inc: { views: 1 },
  });
  if (song) {
    await song.updateMetacritic();
    await song.save();
  }
}
```

**After:**
```javascript
// Media files endpoint only serves data
// View tracking handled separately by frontend
res.send(mediaFile);
```

## Benefits

### 1. **Reduced Network Traffic**
- Eliminates duplicate view tracking requests
- Reduces server load and bandwidth usage
- Improves page load performance

### 2. **Better User Experience**
- Faster page loads (no unnecessary requests)
- No network errors from duplicate tracking
- Seamless browsing experience

### 3. **Improved Reliability**
- Graceful error handling
- Automatic session management
- No impact on core functionality if tracking fails

### 4. **Accurate Analytics**
- One view per session per song (more accurate)
- 24-hour expiry allows fresh tracking
- Better data quality for trending algorithms

## Configuration

### Session Duration
```typescript
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
```

### Storage Keys
```typescript
const VIEWED_SONGS_KEY = 'viewedSongs';
const VIEWED_SONGS_EXPIRY_KEY = 'viewedSongsExpiry';
```

## Monitoring

### Frontend Logs
- View tracking attempts
- Session management events
- Error handling

### Backend Logs
- View tracking requests
- Database operations
- Error responses

## Future Enhancements

1. **Server-Side Deduplication**: Implement server-side session tracking for even better accuracy
2. **Analytics Integration**: Send view data to analytics services
3. **A/B Testing**: Compare different tracking strategies
4. **Real-time Updates**: WebSocket-based real-time view counts

## Testing

### Manual Testing
1. Visit a song detail page
2. Refresh the page multiple times
3. Check network tab - should only see one view tracking request
4. Wait 24 hours or clear localStorage to test expiry

### Automated Testing
```typescript
// Test view tracking deduplication
test('should only track view once per session', () => {
  // Implementation details
});
```

## Troubleshooting

### Common Issues

1. **Views not tracking**: Check localStorage availability and network requests
2. **Duplicate requests**: Verify session expiry and cleanup logic
3. **500 errors**: Check media files endpoint and song view endpoint

### Debug Commands
```javascript
// Check viewed songs
console.log(JSON.parse(localStorage.getItem('viewedSongs') || '[]'));

// Clear viewed songs
localStorage.removeItem('viewedSongs');
localStorage.removeItem('viewedSongsExpiry');
```

This optimization significantly improves the application's performance and reliability while maintaining accurate view tracking for analytics and trending algorithms. 