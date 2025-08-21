import express from "express";
import wrapAsync from "../../utils/wrapAsync.js";
import { signUpUser, loginUser, loginWithGoogle } from "../../controllers/authControllers/userAuth.js";

const router = express.Router();

router.post("/signup", wrapAsync(signUpUser));

router.post("/login", wrapAsync(loginUser));

router.post("/google-login", wrapAsync(loginWithGoogle));


export default router;
