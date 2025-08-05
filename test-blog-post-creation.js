import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Test blog post data
const testPost = {
  title: "Test Blog Post",
  content: "This is a test blog post content with some <strong>HTML</strong> formatting.",
  excerpt: "A brief excerpt of the test post",
  tags: ["test", "music"],
  status: "draft",
  featuredImage: "https://example.com/image.jpg"
};

async function testBlogPostCreation() {
  console.log('🧪 Testing Blog Post Creation...\n');

  try {
    // First, test getting posts to ensure the endpoint is working
    console.log('1. Testing GET /api/posts (should work)');
    const postsResponse = await axios.get(`${API_BASE_URL}/posts`);
    console.log('✅ Posts endpoint working:', postsResponse.status);
    console.log('   Posts count:', postsResponse.data.posts.length);
    
    // Test creating a post (this will fail without auth, but should not be a 500 error)
    console.log('\n2. Testing POST /api/posts (should fail with 401, not 500)');
    try {
      const createResponse = await axios.post(`${API_BASE_URL}/posts`, testPost);
      console.log('✅ Post creation working:', createResponse.status);
      console.log('   Created post slug:', createResponse.data.slug);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Post creation endpoint working (401 auth required - expected)');
      } else if (error.response?.status === 500) {
        console.log('❌ 500 ERROR still occurring!');
        console.log('   Error details:', error.response.data);
      } else {
        console.log('❌ Unexpected error:', error.response?.status, error.response?.data);
      }
    }

    // Test getting admin posts
    console.log('\n3. Testing GET /api/posts/admin (should fail with 401, not 500)');
    try {
      const adminResponse = await axios.get(`${API_BASE_URL}/posts/admin`);
      console.log('✅ Admin posts endpoint working:', adminResponse.status);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Admin posts endpoint working (401 auth required - expected)');
      } else if (error.response?.status === 500) {
        console.log('❌ 500 ERROR in admin posts!');
        console.log('   Error details:', error.response.data);
      } else {
        console.log('❌ Unexpected error:', error.response?.status, error.response?.data);
      }
    }

  } catch (error) {
    console.log('❌ Network error:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Blog post creation test completed!');
  console.log('If you see any 500 errors above, the fix may need adjustment.');
  console.log('='.repeat(60));
}

async function runTests() {
  console.log('🚀 Starting Blog Post Creation Tests...\n');
  
  await testBlogPostCreation();
  
  console.log('\n📋 Summary:');
  console.log('- The 500 error should now be fixed');
  console.log('- Try creating a blog post in the frontend now');
  console.log('- If you still get 500 errors, check the server logs');
}

runTests().catch(console.error); 