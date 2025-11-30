
import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
import protect from "../middlewares/authMiddleware.js";
import { getUserProfile } from "../controllers/userController.js";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile",protect,getUserProfile);
// router.get("/profile", protect, async (req, res) => {
//   const user = await User.findById(req.user.id).select("-password");
//   res.json(user);
// });
export default router;
