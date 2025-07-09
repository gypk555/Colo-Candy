import express from "express";
import cors from "cors";
import multer from "multer";

import { getAllItems, createItem, removeItem } from "../controllers/itemController.js";
import { signup } from "../controllers/signupController.js";
import { login, checkSession, logout } from "../controllers/loginController.js";

const app = express();
app.use(cors()); // Fixed CORS middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// const upload = multer();

const router = express.Router();
// router.use(cors());
// router.use(express.json());
// Configure multer to handle image uploads
const storage = multer.memoryStorage(); // Store images in memory
const upload = multer({ storage: storage });

router.get("/admin", getAllItems);
router.post("/admin", upload.single("image"), createItem);
router.delete("/admin", removeItem);
router.post("/signup", signup);
router.post("/login", login);
router.get("/check-session", checkSession);
router.post("/logout", logout);

export default router;
