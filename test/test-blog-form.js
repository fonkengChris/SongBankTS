import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Test data for creating a post
const testPost = {
  title: "Test Blog Post",
  content: "This is a test blog post content. It contains multiple paragraphs to test the form functionality.",
  excerpt: "A brief excerpt for the test post",
  status: "draft",
  tags: ["test", "blog", "demo"],
  featuredImage: "https://example.com/image.jpg"
};

async function testBlogFormAPI() {
  try {
    console.log('🧪 Testing Blog Post Form API...\n');

    // Test 1: Create a new post
    console.log('1. Testing POST /api/posts (Create Post)');
    const createResponse = await axios.post(`${API_URL}/api/posts`, testPost, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': 'your-test-token-here' // Replace with actual token
      }
    });
    console.log('✅ Post created successfully:', createResponse.data._id);
    const postId = createResponse.data._id;

    // Test 2: Get the created post by ID
    console.log('\n2. Testing GET /api/posts/:id (Get Post by ID)');
    const getResponse = await axios.get(`${API_URL}/api/posts/${postId}`, {
      headers: {
        'x-auth-token': 'your-test-token-here' // Replace with actual token
      }
    });
    console.log('✅ Post retrieved successfully:', getResponse.data.title);

    // Test 3: Update the post
    console.log('\n3. Testing PUT /api/posts/:id (Update Post)');
    const updateData = {
      ...testPost,
      title: "Updated Test Blog Post",
      status: "published"
    };
    const updateResponse = await axios.put(`${API_URL}/api/posts/${postId}`, updateData, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': 'your-test-token-here' // Replace with actual token
      }
    });
    console.log('✅ Post updated successfully:', updateResponse.data.title);

    // Test 4: Delete the post
    console.log('\n4. Testing DELETE /api/posts/:id (Delete Post)');
    const deleteResponse = await axios.delete(`${API_URL}/api/posts/${postId}`, {
      headers: {
        'x-auth-token': 'your-test-token-here' // Replace with actual token
      }
    });
    console.log('✅ Post deleted successfully');

    console.log('\n🎉 All blog form API tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Test form validation
async function testFormValidation() {
  console.log('\n🧪 Testing Form Validation...\n');

  const invalidPosts = [
    {
      name: 'Missing Title',
      data: { content: 'Content only' },
      expectedError: 'title'
    },
    {
      name: 'Missing Content',
      data: { title: 'Title only' },
      expectedError: 'content'
    },
    {
      name: 'Invalid Status',
      data: { title: 'Test', content: 'Content', status: 'invalid' },
      expectedError: 'status'
    }
  ];

  for (const test of invalidPosts) {
    try {
      console.log(`Testing: ${test.name}`);
      await axios.post(`${API_URL}/api/posts`, test.data, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': 'your-test-token-here'
        }
      });
      console.log('❌ Should have failed validation');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Validation working correctly');
      } else {
        console.log('❌ Unexpected error:', error.response?.data);
      }
    }
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Blog Post Form Tests...\n');
  
  await testBlogFormAPI();
  await testFormValidation();
  
  console.log('\n✨ All tests completed!');
}

runTests().catch(console.error); 