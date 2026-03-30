import fs from 'fs'
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs"
import { askAi } from "../service/openRouter.js"


export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) 
        {
          return res.status(400).json({ message : "Resume required"});
        }
                 const filePath = req.file.filePath
                 const fileBuffer = await fs.promises.readFile(filePath)
                 const uint8array = new Uint8Array(fileBuffer)

                 const pdf = await pdfjsLib.getDocument({data:uint8array}).promise;


                 let resumeText = "";

                 for ( let pg = 1 ; pg <= pdf.numPages ; pg++)
                 {
                    const page =  await pdf.getPage(pg);
                    const content = await page.getTextContent();
                    const pageText = await content.items.map(item => item.str).join(" ")
                    resumeText += pageText + "\n"; 
                 }

                 resumeText =resumeText.replace(/\s+/g , " ").trim();

                 const message = [
                    {
                        role : "system",
                        content : `
                        Extract structured data from resume 
                        return strictly JSON 

                        {
                              "role" : "string",
                              "experience" : "string",
                              "projects":"[project1 , project2]",
                              "skills":"[skill1, skill2]"
                           
                        }
                        `
                    },
                    {
                        role:"user",
                        content :resumeText

                    }
                 ]

                 const getAiResponse = await askAi(message);
                 const parsed = JSON.parse(getAiResponse);
                 fs.unlinkSync(filePath)
                
                 res.json({
                    role : parsed.role,
                    experience : parsed.experience,
                    project:parsed.project,
                    skills : parsed.skills,
                    resumeText

                 });
      }
    catch (error) 
    {
       console.error(error);
       if( req.file && fs.existsSync(req.file.path))
        {
            fs.unlinkSync(req.file.path)
        }    
        return res.status(500).json({message : error.message});
    }
};
