// Test the blog posts loading in the frontend
console.log('🧪 Testing Blog Posts Frontend...\n');

// Simulate the API client configuration
const API_URL = "http://localhost:3000";

async function testBlogPosts() {
  console.log('📊 Testing Blog Posts API from Frontend...\n');
  
  try {
    // Test the posts API endpoint
    const response = await fetch(`${API_URL}/api/posts`);
    const data = await response.json();
    
    console.log('✅ Blog posts API response:');
    console.log(`   Status: ${response.status}`);
    console.log(`   Posts count: ${data.posts?.length || 0}`);
    console.log(`   Pagination:`, data.pagination);
    
    if (data.posts && data.posts.length > 0) {
      console.log('\n📝 First post details:');
      const post = data.posts[0];
      console.log(`   Title: ${post.title}`);
      console.log(`   Slug: ${post.slug}`);
      console.log(`   Status: ${post.status}`);
      console.log(`   Author: ${post.authorId?.name}`);
      console.log(`   Created: ${post.createdAt}`);
      console.log(`   Published: ${post.publishedAt || 'Not published'}`);
    } else {
      console.log('\n❌ No posts found in API response');
    }
    
  } catch (error) {
    console.log('❌ Error testing blog posts:', error.message);
  }
}

async function testBlogPage() {
  console.log('\n🌐 Testing Blog Page...\n');
  
  try {
    // Test if the blog page is accessible
    const response = await fetch('http://localhost:5173/blog');
    console.log(`✅ Blog page status: ${response.status}`);
    
    if (response.ok) {
      const html = await response.text();
      if (html.includes('Blog')) {
        console.log('✅ Blog page contains "Blog" text');
      } else {
        console.log('❌ Blog page does not contain expected content');
      }
    } else {
      console.log('❌ Blog page not accessible');
    }
    
  } catch (error) {
    console.log('❌ Error testing blog page:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Blog Frontend Tests...\n');
  
  await testBlogPosts();
  await testBlogPage();
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Blog frontend tests completed!');
  console.log('📋 Next Steps:');
  console.log('1. Open http://localhost:5173/blog in your browser');
  console.log('2. Check if posts are displaying correctly');
  console.log('3. Test the admin blog management at /admin/blog');
  console.log('4. Check browser console for any errors');
  console.log('='.repeat(60));
}

runTests().catch(console.error); 