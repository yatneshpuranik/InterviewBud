import fs from "fs";
import mammoth from "mammoth";
import { askAi } from "../service/openRouter.js";
import User from "../model/userModel.js";
import Interview from "../model/interviewModel.js";

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume required" });
    }

    const filePath = req.file.path;

    // ❌ Reject non-DOCX
    if (
      req.file.mimetype !==
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        message: "Only DOCX files are supported. Please upload a .docx resume.",
      });
    }

    // 🔥 Extract text from DOCX
    const result = await mammoth.extractRawText({ path: filePath });

    let resumeText = result.value;

    // ✅ Clean text
    resumeText = resumeText.replace(/\s+/g, " ").trim();

    console.log("DOCX TEXT:", resumeText);

    // ❌ If extraction failed
    if (!resumeText || resumeText.length < 50) {
      throw new Error("Resume text extraction failed (DOCX)");
    }

    // ✅ AI prompt
    const message = [
      {
        role: "system",
        content: `
Extract structured data from resume.

Return ONLY valid JSON. No explanation, no text outside JSON.

Format:
{
  "role": "string",
  "experience": "string",
  "projects": ["project1", "project2"],
  "skills": ["skill1", "skill2"]
}
        `,
      },
      {
        role: "user",
        content: resumeText,
      },
    ];

    const getAiResponse = await askAi(message);

    console.log("AI RAW RESPONSE:", getAiResponse);

    let parsed;

    // ✅ Safe JSON parsing
    try {
      const cleaned = getAiResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error("JSON parse failed:", getAiResponse);
      throw new Error("Invalid JSON from AI");
    }

    // 🧹 delete file
    fs.unlinkSync(filePath);

    res.json({
      role: parsed.role || "",
      experience: parsed.experience || "",
      projects: parsed.projects || [],
      skills: parsed.skills || [],
      resumeText,
    });

  } catch (error) {
    console.error(error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({ message: error.message });
  }
};


export const generateQuestions = async (req, res) => {
  try {
    const { role, experience,mode , resumeText, projects , skills } = req.body;  
    role = role.trim();
    experience = experience.trim();
    mode = mode.trim();
    if(!role || !experience || !mode){
      return res.status(400).json({ message: "Role, experience and mode are required" });
    }
    const safeResume = resumeText ? resumeText.trim() : null ;
    const projectText = Array.isArray(projects) && projects.length ? projects.join(", ") : "None" ;
    const skillText = Array.isArray(skills) && skills.length ? skills.join(", ") : "None" ;

    const user = await User.findById(req.user.id);

    if(!user)
    {
      return res.status(404).json({ message: "User not found" });
    }


    const userPrompt = `
    Role:${role}
    Experience:${experience}
    InterviewMode:${mode}
    Projects:${projectText}
    Skills:${skillText},
    Resume:${safeResume}
    `;
      if (!userPrompt.trim()) {
        return res.status(400).json({ message: "No user prompt" });
      }
    const message = [
      {
        role: "system",
        content:`You are a real human interviewer conducting a professional interview.

Speak in simple, natural English as if you are directly talking to the candidate.

Generate exactly 5 interview questions.

Strict Rules:
- Each question must contain between 15 and 25 words.
- Each question must be a single complete sentence.
- Do NOT number them.
- Do NOT add explanations.
- Do NOT add extra text before or after.
- One question per line only.
- Keep language simple and conversational.
- Questions must feel practical and realistic.

Difficulty progression:
Question 1 → easy  
Question 2 → easy  
Question 3 → medium  
Question 4 → medium  
Question 5 → hard  

Make questions based on the candidate’s role, experience,interviewMode, projects, skills, and resume details.
        `
      },
      {
        role: "user",
        content: userPrompt
      }
    ]
    ;
    const aiResponse = await askAi(message);
    if(!aiResponse.trim())
    {
      return res.status(500).json({ message: "AI sent no response " });
    }
    const questionsArray = aiResponse.split("\n").map(q => q.trim()).filter(q => q.length > 0).slice(0,5);
    if(questionsArray.length === 0)    {
      return res.status(500).json({ message: "AI returned no valid questions" });
    }
    
    const interview = await Interview.create({
      userid: user._id,
      role,
      experience,
      mode,
      resumeText,
      questions: questionsArray.map((q, index) => ({ question: q , 
        difficulty: index < 2 ? "easy" : index < 4 ? "medium" : "hard",
        timeLimit:[60,60,90,90,120][index]
      }))
    });

    res.json({
      interviewId: interview._id,
      userName: user.name,
      questions: interview.questions
    })
  }
    catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
    }
  }

  