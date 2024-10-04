const Supervisor = require("../Models/Supervisor");
const Hashing = require("../Services/Hashing");
const TokenGenerator = require("../Services/TokenGenerator");

const RegisterController = {
  login: async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    try {
      const [supervisor] = await Supervisor.find({ email: email });
      console.log(supervisor);
      //   ------------------------------------------------
      // Hashing
      //   ------------------------------------------------
      if (supervisor.password != password)
        return res.status(400).json({ msg: "Incorrect Email Or Password" });
      //   ------------------------------------------------
      // Token
      const payload = {
        email: supervisor.email,
        createdAt: supervisor.createdAt
      };
      const token = await TokenGenerator.generate(payload);
      console.log("Token: ", token);
      return res.status(200).cookie("Token", token).json({ msg: "Found", supervisor: supervisor });
    } catch (error) {
      return res.status(500).json({ msg: "Somthing Went Wrong" });
    }
  },
};
module.exports = RegisterController;
