import express from "express";
import wrapAsync from "../../utils/wrapAsync.js";
import { signUpUser, loginUser, getLoginUser } from "../../controllers/authControllers/userAuth.js";

const router = express.Router();

router.post("/signup", wrapAsync(signUpUser));

router.post("/login", wrapAsync(loginUser));

router.get("/get-user", wrapAsync(getLoginUser));



export default router;
