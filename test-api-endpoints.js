import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

async function testAllEndpoints() {
  console.log('🔍 Testing all API endpoints to identify the 500 error...\n');

  const endpoints = [
    { name: 'Health Check', url: '/health', method: 'GET' },
    { name: 'Songs', url: '/songs', method: 'GET' },
    { name: 'Posts (Public)', url: '/posts', method: 'GET' },
    { name: 'Posts Tags', url: '/posts/tags/all', method: 'GET' },
    { name: 'Comments (with real song ID)', url: '/comments/68641b86e0baf5ac46810961', method: 'GET' },
    { name: 'Categories', url: '/categories', method: 'GET' },
    { name: 'Languages', url: '/languages', method: 'GET' },
    { name: 'Notations', url: '/notations', method: 'GET' },
    { name: 'Media Files', url: '/media_files', method: 'GET' },
    { name: 'Videos', url: '/videos', method: 'GET' },
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint.name}...`);
      const response = await axios({
        method: endpoint.method,
        url: `${API_BASE_URL}${endpoint.url}`,
        timeout: 5000
      });
      
      console.log(`✅ ${endpoint.name}: ${response.status} - ${response.statusText}`);
      
      // Show response structure for debugging
      if (response.data && typeof response.data === 'object') {
        const keys = Object.keys(response.data);
        console.log(`   Response keys: ${keys.join(', ')}`);
      }
      
    } catch (error) {
      console.log(`❌ ${endpoint.name}: ${error.response?.status || 'Network Error'} - ${error.response?.data?.error || error.message}`);
      
      if (error.response?.status === 500) {
        console.log(`   🔥 500 ERROR DETECTED in ${endpoint.name}!`);
        console.log(`   Error details:`, error.response.data);
      }
    }
    console.log('');
  }

  console.log('='.repeat(60));
  console.log('✅ Endpoint testing completed!');
  console.log('If you see a 500 error above, that\'s likely the source of your problem.');
  console.log('='.repeat(60));
}

async function testProtectedEndpoints() {
  console.log('\n🔐 Testing protected endpoints (will fail without auth)...\n');

  const protectedEndpoints = [
    { name: 'Posts Admin', url: '/posts/admin', method: 'GET' },
    { name: 'Users', url: '/users', method: 'GET' },
    { name: 'Create Comment', url: '/comments/68641b86e0baf5ac46810961', method: 'POST', data: { comment: 'test' } },
  ];

  for (const endpoint of protectedEndpoints) {
    try {
      console.log(`Testing ${endpoint.name}...`);
      const config = {
        method: endpoint.method,
        url: `${API_BASE_URL}${endpoint.url}`,
        timeout: 5000
      };
      
      if (endpoint.data) {
        config.data = endpoint.data;
        config.headers = { 'Content-Type': 'application/json' };
      }
      
      const response = await axios(config);
      console.log(`✅ ${endpoint.name}: ${response.status} - ${response.statusText}`);
      
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.error || error.message;
      
      if (status === 401 || status === 403) {
        console.log(`✅ ${endpoint.name}: ${status} - Authentication required (expected)`);
      } else if (status === 500) {
        console.log(`❌ ${endpoint.name}: ${status} - ${message}`);
        console.log(`   🔥 500 ERROR DETECTED in ${endpoint.name}!`);
      } else {
        console.log(`❌ ${endpoint.name}: ${status || 'Network Error'} - ${message}`);
      }
    }
    console.log('');
  }
}

async function runTests() {
  console.log('🚀 Starting API Endpoint Tests...\n');
  
  await testAllEndpoints();
  await testProtectedEndpoints();
  
  console.log('\n📋 Summary:');
  console.log('- Check the output above for any 500 errors');
  console.log('- If you see a 500 error, that endpoint needs investigation');
  console.log('- Protected endpoints should return 401/403 (authentication required)');
  console.log('- Public endpoints should return 200 with data');
}

runTests().catch(console.error); 