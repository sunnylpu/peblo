const axios = require("axios");
axios.post("http://localhost:5001/api/auth/signup", {
  name: "Test User",
  email: "test5@example.com",
  password: "Password123!"
}).then(res => console.log("OK", res.data)).catch(err => console.log("ERR", err.response?.data));
