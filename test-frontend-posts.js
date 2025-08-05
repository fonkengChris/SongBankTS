import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

async function testFrontendPosts() {
  console.log('🧪 Testing Frontend Posts API...\n');

  try {
    // Test public posts endpoint
    console.log('1. Testing GET /api/posts (public)');
    const publicResponse = await axios.get(`${API_BASE_URL}/posts`);
    console.log('✅ Public posts endpoint working:', publicResponse.status);
    console.log('   Posts count:', publicResponse.data.posts.length);
    console.log('   Pagination:', publicResponse.data.pagination);
    
    if (publicResponse.data.posts.length > 0) {
      const post = publicResponse.data.posts[0];
      console.log('   First post:');
      console.log(`     Title: ${post.title}`);
      console.log(`     Slug: ${post.slug}`);
      console.log(`     Status: ${post.status}`);
      console.log(`     Author: ${post.authorId?.name}`);
    }
    
    // Test with authentication (simulate admin access)
    console.log('\n2. Testing GET /api/posts/admin (with auth)');
    try {
      // This will fail without auth, but should not be 500
      const adminResponse = await axios.get(`${API_BASE_URL}/posts/admin`);
      console.log('✅ Admin posts endpoint working:', adminResponse.status);
      console.log('   Posts count:', adminResponse.data.posts.length);
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

    // Test individual post by slug
    if (publicResponse.data.posts.length > 0) {
      const slug = publicResponse.data.posts[0].slug;
      console.log(`\n3. Testing GET /api/posts/slug/${slug}`);
      try {
        const postResponse = await axios.get(`${API_BASE_URL}/posts/slug/${slug}`);
        console.log('✅ Individual post endpoint working:', postResponse.status);
        console.log(`   Post title: ${postResponse.data.title}`);
      } catch (error) {
        console.log('❌ Error getting individual post:', error.response?.status, error.response?.data);
      }
    }

  } catch (error) {
    console.log('❌ Network error:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Frontend posts test completed!');
  console.log('If posts are showing in API but not in frontend:');
  console.log('1. Check browser console for errors');
  console.log('2. Check React Query cache');
  console.log('3. Verify the frontend is using the correct API endpoint');
  console.log('='.repeat(60));
}

async function runTests() {
  console.log('🚀 Starting Frontend Posts Tests...\n');
  
  await testFrontendPosts();
  
  console.log('\n📋 Next Steps:');
  console.log('- Check the browser console for any JavaScript errors');
  console.log('- Verify the frontend is making requests to the correct API');
  console.log('- Check if React Query is caching the data properly');
}

runTests().catch(console.error); 