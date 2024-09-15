const bcrypt = require("bcryptjs");
const Hashing = {
  hashText: async (saltRounds = 20, text) => {
    try {
      const hashing = bcrypt.hashSync(text, 20);
      console.log(hashing);
      return hashing;
    } catch (error) {
      return error;
    }
  },
  deHashText: async (text, hashedText) => {
    try {
      const compare = bcrypt.compareSync(text, hashedText);
      console.log(compare);
    } catch (error) {
      return error;
    }
  },
};
module.exports = Hashing;
