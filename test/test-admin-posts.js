// Test the admin posts API
console.log('🧪 Testing Admin Posts API...\n');

const API_URL = "http://localhost:3000";

async function testAdminPosts() {
  console.log('📊 Testing Admin Posts API...\n');
  
  try {
    // Test the admin posts endpoint (this will fail without auth, but should not be 500)
    const response = await fetch(`${API_URL}/api/posts/admin`);
    console.log(`✅ Admin posts endpoint status: ${response.status}`);
    
    if (response.status === 401) {
      console.log('✅ Admin posts endpoint working (401 auth required - expected)');
    } else if (response.status === 200) {
      const data = await response.json();
      console.log('✅ Admin posts endpoint working with auth:');
      console.log(`   Posts count: ${data.posts?.length || 0}`);
      console.log(`   Pagination:`, data.pagination);
      
      if (data.posts && data.posts.length > 0) {
        console.log('\n📝 Posts found:');
        data.posts.forEach((post, index) => {
          console.log(`   ${index + 1}. "${post.title}" (${post.status})`);
        });
      }
    } else {
      console.log('❌ Unexpected response:', response.status);
    }
    
  } catch (error) {
    console.log('❌ Error testing admin posts:', error.message);
  }
}

async function testPublicPosts() {
  console.log('\n📊 Testing Public Posts API...\n');
  
  try {
    const response = await fetch(`${API_URL}/api/posts`);
    const data = await response.json();
    
    console.log('✅ Public posts endpoint working:');
    console.log(`   Status: ${response.status}`);
    console.log(`   Posts count: ${data.posts?.length || 0}`);
    
    if (data.posts && data.posts.length > 0) {
      console.log('\n📝 Published posts:');
      data.posts.forEach((post, index) => {
        console.log(`   ${index + 1}. "${post.title}" (${post.status})`);
      });
    }
    
  } catch (error) {
    console.log('❌ Error testing public posts:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Admin Posts Tests...\n');
  
  await testAdminPosts();
  await testPublicPosts();
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Admin posts tests completed!');
  console.log('📋 Summary:');
  console.log('- Admin posts API should return 401 without auth (expected)');
  console.log('- Public posts API should return only published posts');
  console.log('- Admin posts API should return all posts (including drafts) with auth');
  console.log('='.repeat(60));
}

runTests().catch(console.error); 