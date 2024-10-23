import Teacher from "./../models/teachers.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { userName, password } = req.body;
  console.log(userName,password);

  try {
    const user = await Teacher.findOne({ userName });
    // console.log(user);
    if (!user) {
      //  console.log(userName, password,"user");
      return res.status(400).json({ message: "Invalid username or password" });
    }

    if (user.password !== password) {
      // console.log(userName, password, "password");
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const secretKey = process.env.secretKey;
    // console.log(secretKey);
    const token = jwt.sign({ userId: user._id, role: user.role }, secretKey, {
      expiresIn: "1d",
    });

    // console.log(token);

    res.status(200).json({ token });
  } catch (e) {
    res.send(e);
  }
};
