import express from "express";
import wrapAsync from "../../utils/wrapAsync.js";
import { signUpUser, loginUser } from "../../controllers/authControllers/userAuth.js";

const router = express.Router();

router.post("/signup", wrapAsync(signUpUser));

router.post("/login", wrapAsync(loginUser));



export default router;
