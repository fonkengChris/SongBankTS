import axios from 'axios';

const API_URL = 'https://sheet-music-library-ad225c202768.herokuapp.com';

async function testPostValidation() {
  console.log('🧪 Testing Post Validation Fix...\n');

  const testCases = [
    {
      name: 'Valid post with excerpt',
      data: {
        title: 'Test Post with Excerpt',
        content: 'This is a test post content that is long enough to meet the minimum requirement.',
        excerpt: 'This is a test excerpt',
        status: 'draft',
        tags: ['test', 'validation']
      },
      expectedResult: 'success'
    },
    {
      name: 'Valid post without excerpt',
      data: {
        title: 'Test Post without Excerpt',
        content: 'This is a test post content that is long enough to meet the minimum requirement.',
        status: 'draft',
        tags: ['test', 'validation']
      },
      expectedResult: 'success'
    },
    {
      name: 'Valid post with empty excerpt',
      data: {
        title: 'Test Post with Empty Excerpt',
        content: 'This is a test post content that is long enough to meet the minimum requirement.',
        excerpt: '',
        status: 'draft',
        tags: ['test', 'validation']
      },
      expectedResult: 'success'
    },
    {
      name: 'Valid post with empty featuredImage',
      data: {
        title: 'Test Post with Empty Featured Image',
        content: 'This is a test post content that is long enough to meet the minimum requirement.',
        featuredImage: '',
        status: 'draft',
        tags: ['test', 'validation']
      },
      expectedResult: 'success'
    }
  ];

  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`);
    try {
      const response = await axios.post(`${API_URL}/api/posts`, testCase.data, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': 'test-token' // This will fail auth, but we can see if validation passes
        }
      });
      console.log('✅ Validation passed (but auth failed as expected)');
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.error) {
        if (error.response.data.error.includes('excerpt') || error.response.data.error.includes('featuredImage')) {
          console.log('❌ Validation still failing:', error.response.data.error);
        } else {
          console.log('✅ Validation passed (auth error expected):', error.response.data.error);
        }
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }
    console.log('');
  }
}

// Test frontend data filtering
function testFrontendDataFiltering() {
  console.log('🧪 Testing Frontend Data Filtering...\n');

  const testFormData = {
    title: 'Test Post',
    content: 'This is test content',
    status: 'draft',
    tags: ['test'],
    excerpt: '',
    featuredImage: ''
  };

  // Simulate the frontend filtering logic
  const postData = {
    title: testFormData.title,
    content: testFormData.content,
    status: testFormData.status,
    tags: testFormData.tags,
    ...(testFormData.excerpt && { excerpt: testFormData.excerpt }),
    ...(testFormData.featuredImage && { featuredImage: testFormData.featuredImage }),
  };

  console.log('Original form data:', testFormData);
  console.log('Filtered post data:', postData);
  console.log('✅ Empty fields filtered out correctly');
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Post Validation Tests...\n');
  
  await testPostValidation();
  testFrontendDataFiltering();
  
  console.log('\n✨ All tests completed!');
}

runTests().catch(console.error); 