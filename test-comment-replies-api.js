import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Test data
const testData = {
  songId: '507f1f77bcf86cd799439011', // This will be replaced with actual song ID
  comment: 'This is a test comment with @mention',
  reply: 'This is a reply to the test comment',
  nestedReply: 'This is a nested reply'
};

async function testCommentRepliesAPI() {
  console.log('🧪 Testing Comment Reply API Endpoints...\n');

  try {
    // First, let's get a list of songs to use a real song ID
    console.log('📋 Getting available songs...');
    const songsResponse = await axios.get(`${API_BASE_URL}/api/songs`);
    const songs = songsResponse.data;
    
    if (songs.length === 0) {
      console.log('❌ No songs found in the API');
      return;
    }

    const songId = songs[0]._id;
    console.log(`✅ Using song: ${songs[0].title} (ID: ${songId})\n`);

    // Test 1: Create a top-level comment
    console.log('1️⃣ Creating top-level comment...');
    const topLevelComment = await axios.post(`${API_BASE_URL}/api/comments/${songId}`, {
      comment: testData.comment,
      mentions: []
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': 'your-jwt-token-here' // You'll need to replace this with a real token
      }
    });
    console.log('✅ Top-level comment created:', topLevelComment.data.comment);

    // Test 2: Create a reply to the top-level comment
    console.log('\n2️⃣ Creating reply to top-level comment...');
    const reply = await axios.post(`${API_BASE_URL}/api/comments/${songId}`, {
      comment: testData.reply,
      parentId: topLevelComment.data._id,
      mentions: []
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': 'your-jwt-token-here'
      }
    });
    console.log('✅ Reply created:', reply.data.comment);

    // Test 3: Create a nested reply
    console.log('\n3️⃣ Creating nested reply...');
    const nestedReply = await axios.post(`${API_BASE_URL}/api/comments/${songId}`, {
      comment: testData.nestedReply,
      parentId: reply.data._id,
      mentions: []
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': 'your-jwt-token-here'
      }
    });
    console.log('✅ Nested reply created:', nestedReply.data.comment);

    // Test 4: Get all comments with replies
    console.log('\n4️⃣ Fetching comments with replies...');
    const commentsResponse = await axios.get(`${API_BASE_URL}/api/comments/${songId}`);
    const comments = commentsResponse.data.comments;
    console.log(`✅ Found ${comments.length} top-level comments`);
    
    comments.forEach((comment, index) => {
      console.log(`  Comment ${index + 1}: ${comment.comment}`);
      if (comment.replies && comment.replies.length > 0) {
        console.log(`    Replies: ${comment.replies.length}`);
        comment.replies.forEach((reply, replyIndex) => {
          console.log(`      Reply ${replyIndex + 1}: ${reply.comment} (depth: ${reply.depth})`);
        });
      }
    });

    // Test 5: Get replies for a specific comment
    console.log('\n5️⃣ Fetching replies for specific comment...');
    const repliesResponse = await axios.get(`${API_BASE_URL}/api/comments/${topLevelComment.data._id}/replies`);
    const replies = repliesResponse.data.replies;
    console.log(`✅ Found ${replies.length} replies for comment`);

    console.log('\n' + '='.repeat(60));
    console.log('✅ Comment Reply API Test Completed Successfully!');
    console.log('📋 Summary:');
    console.log('- Top-level comment creation works');
    console.log('- Reply creation works');
    console.log('- Nested reply creation works');
    console.log('- Comments with replies fetching works');
    console.log('- Individual replies fetching works');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Error testing comment replies API:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n💡 Note: You need to be authenticated to create comments.');
      console.log('   Please log in and get a valid JWT token to test comment creation.');
    }
  }
}

// Test the API endpoints
testCommentRepliesAPI(); 