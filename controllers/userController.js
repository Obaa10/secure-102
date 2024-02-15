import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

function generateToken(user) {
  const SECRET_KEY = process.env.SECRET_KEY;
  return jwt.sign({ user: user }, SECRET_KEY, {
    expiresIn: "1h",
  });
}

export async function signup(req, res) {
  try {
    const { fullName, userName, password, idNumber } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      userName,
      password: hashedPassword,
      idNumber,
    });
    await newUser.save();
    const token = generateToken(newUser);
    res.status(201).json({ token: token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = generateToken(user);
    res.status(201).json({ token: token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
