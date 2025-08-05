// Test the API client configuration
console.log('🧪 Testing API Client Configuration...\n');

// Simulate the environment check
const isDevelopment = true; // We're in development
const apiUrl = isDevelopment
  ? "http://localhost:3000"
  : "https://sheet-music-library-ad225c202768.herokuapp.com";

console.log('📊 Environment Configuration:');
console.log(`   Development mode: ${isDevelopment}`);
console.log(`   API URL: ${apiUrl}`);
console.log(`   VITE_API_URL: ${process.env.VITE_API_URL || 'undefined'}`);

// Test the actual API call
import axios from 'axios';

const testApiCall = async () => {
  console.log('\n🔍 Testing API Call...');
  
  try {
    // Test with the configured API URL
    const response = await axios.get(`${apiUrl}/api/posts`);
    console.log('✅ API call successful!');
    console.log(`   Status: ${response.status}`);
    console.log(`   Posts count: ${response.data.posts.length}`);
    console.log(`   First post title: ${response.data.posts[0]?.title || 'No posts'}`);
  } catch (error) {
    console.log('❌ API call failed:', error.message);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Data: ${JSON.stringify(error.response.data)}`);
    }
  }
};

testApiCall(); 