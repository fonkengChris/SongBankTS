// View tracking utilities

const VIEWED_SONGS_KEY = 'viewedSongs';
const VIEWED_SONGS_EXPIRY_KEY = 'viewedSongsExpiry';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Cache for viewed songs to reduce localStorage reads
let viewedSongsCache: string[] | null = null;
let cacheExpiry: number | null = null;

/**
 * Get the list of viewed songs from localStorage with caching
 */
export const getViewedSongs = (): string[] => {
  try {
    // Check cache first
    if (viewedSongsCache && cacheExpiry && Date.now() < cacheExpiry) {
      return viewedSongsCache;
    }

    const viewedSongs = localStorage.getItem(VIEWED_SONGS_KEY);
    const songs = viewedSongs ? JSON.parse(viewedSongs) : [];
    
    // Update cache
    viewedSongsCache = songs;
    cacheExpiry = Date.now() + 60000; // Cache for 1 minute
    
    return songs;
  } catch (error) {
    console.error('Error reading viewed songs from localStorage:', error);
    return [];
  }
};

/**
 * Add a song to the viewed songs list
 */
export const addViewedSong = (songId: string): void => {
  try {
    const viewedSongs = getViewedSongs();
    if (!viewedSongs.includes(songId)) {
      viewedSongs.push(songId);
      localStorage.setItem(VIEWED_SONGS_KEY, JSON.stringify(viewedSongs));
      
      // Update cache
      viewedSongsCache = viewedSongs;
      
      // Set expiry time
      const expiryTime = Date.now() + SESSION_DURATION;
      localStorage.setItem(VIEWED_SONGS_EXPIRY_KEY, expiryTime.toString());
    }
  } catch (error) {
    console.error('Error adding viewed song to localStorage:', error);
  }
};

/**
 * Check if a song has been viewed in the current session
 */
export const hasViewedSong = (songId: string): boolean => {
  try {
    const viewedSongs = getViewedSongs();
    return viewedSongs.includes(songId);
  } catch (error) {
    console.error('Error checking viewed song in localStorage:', error);
    return false;
  }
};

/**
 * Clear all viewed songs (useful on logout or session expiry)
 */
export const clearViewedSongs = (): void => {
  try {
    localStorage.removeItem(VIEWED_SONGS_KEY);
    localStorage.removeItem(VIEWED_SONGS_EXPIRY_KEY);
    
    // Clear cache
    viewedSongsCache = null;
    cacheExpiry = null;
  } catch (error) {
    console.error('Error clearing viewed songs from localStorage:', error);
  }
};

/**
 * Check if the viewed songs session has expired and clear if necessary
 */
export const checkAndClearExpiredSession = (): void => {
  try {
    const expiryTime = localStorage.getItem(VIEWED_SONGS_EXPIRY_KEY);
    if (expiryTime && Date.now() > parseInt(expiryTime)) {
      clearViewedSongs();
    }
  } catch (error) {
    console.error('Error checking session expiry:', error);
    // If there's an error, clear anyway to be safe
    clearViewedSongs();
  }
};

/**
 * Initialize view tracking (call this on app startup)
 */
export const initializeViewTracking = (): void => {
  checkAndClearExpiredSession();
}; 