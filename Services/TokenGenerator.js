const jwt = require("jsonwebtoken");
const TokenGenerator = {
  generate: async (data) => {
    const token = jwt.sign(data, process.env.SECRET_KEY);
    if (token) return token;
  },
};
module.exports = TokenGenerator;
