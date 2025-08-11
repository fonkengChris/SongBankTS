import axios from "axios";

// Test the API calls that the frontend would make
const API_URL = "https://sheet-music-library-ad225c202768.herokuapp.com";

async function testFrontendAPI() {
  console.log("🧪 Testing frontend API calls...");
  console.log(`API URL: ${API_URL}\n`);

  try {
    // Test 1: Trending songs (what TrendingSongs component calls)
    console.log("1️⃣ Testing trending songs endpoint (TrendingSongs component)...");
    try {
      const trendingResponse = await axios.get(`${API_URL}/api/songs/trending?limit=5`);
      console.log("✅ Trending endpoint working");
      console.log(`Found ${trendingResponse.data.length} trending songs`);
      
      if (trendingResponse.data.length > 0) {
        console.log("Sample trending songs:");
        trendingResponse.data.slice(0, 3).forEach((song, index) => {
          console.log(`  ${index + 1}. ${song.title} - Trending: ${song.trendingScore || 0}`);
        });
      }
    } catch (error) {
      console.log("❌ Trending endpoint failed:", error.message);
      if (error.response) {
        console.log("Response status:", error.response.status);
        console.log("Response data:", error.response.data);
      }
    }

    // Test 2: Popular songs (what PopularSongs component calls)
    console.log("\n2️⃣ Testing popular songs endpoint (PopularSongs component)...");
    try {
      const popularResponse = await axios.get(`${API_URL}/api/songs?sortOrder=-metacritic&limit=5`);
      console.log("✅ Popular songs endpoint working");
      console.log(`Found ${popularResponse.data.songs?.length || 0} popular songs`);
      
      if (popularResponse.data.songs && popularResponse.data.songs.length > 0) {
        console.log("Sample popular songs:");
        popularResponse.data.songs.slice(0, 3).forEach((song, index) => {
          console.log(`  ${index + 1}. ${song.title} - Metacritic: ${song.metacritic || 0}`);
        });
      }
    } catch (error) {
      console.log("❌ Popular songs endpoint failed:", error.message);
      if (error.response) {
        console.log("Response status:", error.response.status);
        console.log("Response data:", error.response.data);
      }
    }

    // Test 3: Check if songs have media files (required for UI display)
    console.log("\n3️⃣ Testing songs with media files...");
    try {
      const songsResponse = await axios.get(`${API_URL}/api/songs?limit=10`);
      if (songsResponse.data.songs) {
        const songsWithMedia = songsResponse.data.songs.filter(song => 
          song.mediaFiles && song.mediaFiles.length > 0
        );
        console.log(`✅ Found ${songsWithMedia.length} songs with media files out of ${songsResponse.data.songs.length} total`);
        
        if (songsWithMedia.length === 0) {
          console.log("❌ CRITICAL: No songs have media files! This explains why nothing loads in the UI.");
        } else {
          console.log("✅ Songs have media files - UI should display them");
        }
      }
    } catch (error) {
      console.log("❌ Failed to check songs with media files:", error.message);
    }

    // Test 4: Check CORS headers
    console.log("\n4️⃣ Testing CORS headers...");
    try {
      const corsResponse = await axios.options(`${API_URL}/api/songs/trending`);
      console.log("✅ CORS preflight request successful");
      console.log("CORS headers:", corsResponse.headers);
    } catch (error) {
      console.log("❌ CORS preflight failed:", error.message);
    }

  } catch (error) {
    console.error("❌ General API test error:", error.message);
  }
}

// Run the test
testFrontendAPI(); 