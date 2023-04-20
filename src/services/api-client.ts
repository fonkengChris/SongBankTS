import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:8000/",
});

export const REGISTER_URL = "/auth/users/";
export const CUSTOMER_URL = "/library/customers/";

// const jwt_token = 'your_jwt_token';

// axios.get('https://example.com/api/data', {
//     headers: {
//         'Authorization': `Bearer ${jwt_token}`
//     }
// })
