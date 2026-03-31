import express from "express"
import {upload } from "../middleware/multer.js"
import isAuth from "../middleware/isAuth.js"
import { analyzeResume } from "../controller/interviewController.js";

const interviewRouter = express.Router();

interviewRouter.post('/resume', isAuth, upload.single('resume'), analyzeResume );

export default interviewRouter ;
