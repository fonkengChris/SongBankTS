import axios from 'axios';

const API_URL = 'https://sheet-music-library-ad225c202768.herokuapp.com';

async function testAuthToken() {
  try {
    console.log('🔍 Testing Authentication Token...\n');

    // Test 1: Check if we can access a protected endpoint
    console.log('1. Testing GET /api/posts/admin (Admin endpoint)');
    try {
      const response = await axios.get(`${API_URL}/api/posts/admin`, {
        headers: {
          'x-auth-token': 'test-token'
        }
      });
      console.log('✅ Admin endpoint accessible');
    } catch (error) {
      console.log('❌ Admin endpoint failed:', error.response?.data || error.message);
    }

    // Test 2: Check if we can access a public endpoint
    console.log('\n2. Testing GET /api/posts (Public endpoint)');
    try {
      const response = await axios.get(`${API_URL}/api/posts`);
      console.log('✅ Public endpoint accessible');
      console.log('Posts count:', response.data.posts?.length || 0);
    } catch (error) {
      console.log('❌ Public endpoint failed:', error.response?.data || error.message);
    }

    // Test 3: Test with a valid token (if available)
    console.log('\n3. Testing with localStorage token');
    // This would need to be run in a browser context
    console.log('Note: This test requires browser context to access localStorage');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

async function testPostCreation() {
  console.log('\n🧪 Testing Post Creation with different scenarios...\n');

  const testCases = [
    {
      name: 'Valid post data (no auth)',
      data: {
        title: 'Test Post',
        content: 'This is a test post content that is long enough to meet the minimum requirement.',
        status: 'draft'
      },
      headers: {}
    },
    {
      name: 'Valid post data (with auth)',
      data: {
        title: 'Test Post',
        content: 'This is a test post content that is long enough to meet the minimum requirement.',
        status: 'draft'
      },
      headers: {
        'x-auth-token': 'test-token'
      }
    },
    {
      name: 'Missing required fields',
      data: {
        title: 'Test Post'
        // Missing content
      },
      headers: {
        'x-auth-token': 'test-token'
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`);
    try {
      const response = await axios.post(`${API_URL}/api/posts`, testCase.data, {
        headers: {
          'Content-Type': 'application/json',
          ...testCase.headers
        }
      });
      console.log('✅ Success:', response.status);
    } catch (error) {
      console.log('❌ Failed:', error.response?.status, error.response?.data || error.message);
    }
    console.log('');
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Authentication Tests...\n');
  
  await testAuthToken();
  await testPostCreation();
  
  console.log('\n✨ All tests completed!');
}

runTests().catch(console.error); 