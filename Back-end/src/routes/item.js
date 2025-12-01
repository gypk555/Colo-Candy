import express from "express";
import multer from "multer";

import { getAllItems, createItem, removeItem } from "../controllers/itemController.js";
import { signup } from "../controllers/signupController.js";
import { login, checkSession, logout } from "../controllers/loginController.js";
import { getCart, syncCart } from "../controllers/cartController.js";

const router = express.Router();

// Configure multer to handle image uploads
const storage = multer.memoryStorage(); // Store images in memory
const upload = multer({ storage });

router.get("/admin", getAllItems);
router.post("/admin", upload.single("image"), createItem);
router.delete("/admin", removeItem);
router.post("/signup", signup);
router.post("/login", login);
router.get("/check-session", checkSession);
router.post("/logout", logout);

// Cart routes
router.get("/cart", getCart);
router.post("/cart/sync", syncCart);

export default router;
