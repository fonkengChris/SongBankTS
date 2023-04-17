import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:8000/library",
});

// const jwt_token = 'your_jwt_token';

// axios.get('https://example.com/api/data', {
//     headers: {
//         'Authorization': `Bearer ${jwt_token}`
//     }
// })
