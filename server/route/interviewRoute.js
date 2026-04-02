import express from "express"
import {upload } from "../middleware/multer.js"
import isAuth from "../middleware/isAuth.js"
import { analyzeResume, finishInterview, generateQuestions, getInterviewReport, getMyInterviews, submitAnswers } from "../controller/interviewController.js";

const interviewRouter = express.Router();

interviewRouter.post('/resume', isAuth, upload.single('resume'), analyzeResume );
interviewRouter.post('/generate-questions' , isAuth , generateQuestions );
interviewRouter.post('/submit-answers', isAuth , submitAnswers);
interviewRouter.post('/finish', isAuth, finishInterview );
interviewRouter.get('/get-interviews', isAuth, getMyInterviews);
interviewRouter.get("/report/:id", isAuth, getInterviewReport );


export default interviewRouter ;
