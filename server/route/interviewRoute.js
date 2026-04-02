import express from "express"
import {upload } from "../middleware/multer.js"
import isAuth from "../middleware/isAuth.js"
import { analyzeResume, finishInterview, generateQuestions, submitAnswers } from "../controller/interviewController.js";

const interviewRouter = express.Router();

interviewRouter.post('/resume', isAuth, upload.single('resume'), analyzeResume );
interviewRouter.post('/generate-questions' , isAuth , generateQuestions );
interviewRouter.post('/submit-answers', isAuth , submitAnswers);
interviewRouter.post('/finish', isAuth, finishInterview );

export default interviewRouter ;
