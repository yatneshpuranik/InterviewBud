import express from "express"
import { googleAuth , Logout } from "../controller/authGoogleController.js";
const authRouter = express.Router();

authRouter.post('/google' , googleAuth);
authRouter.get('/logout', Logout);

export default authRouter ;
