import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; // if you use hashed passwords
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";


const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const user = await User.findOne({ email });
  console.log(user);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user._id);

  res.status(200).json({ token });
};


export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashedPassword });

  const token = generateToken(newUser._id);

  res.status(201).json({ token });
};

export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password"); // remove password from response

  if (!user) {
    console.log("User ki dikkat");
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
};
