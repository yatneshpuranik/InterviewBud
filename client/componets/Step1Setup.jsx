import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { FaUserTie, FaChartLine, FaMicrophoneAlt, FaFileUpload } from 'react-icons/fa'
import axios from 'axios'

const Step1Setup = ({ onStart }) => {
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(false);
  const [experience, setExperience] = useState('')
  const [interview, setInterview] = useState("technical")
  const [project, setProject] = useState([])
  const [skills, setSkills] = useState([])
  const [resumeFile, setResumeFile] = useState(null)
  const [resumeText, setResumeText] = useState("")
  const [analysisDone, setAnalysisDone] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  // ✅ PASTE SUPPORT (NO AUTO UPLOAD)
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData.items;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (item.kind === "file") {
          const file = item.getAsFile();

          if (file) {
            // console.log("Pasted file:", file);
            setResumeFile(file); // ✅ only set file
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);



   const handleStart = async () =>
   {
      setLoading(true);

      try { 
              const result = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/interview/generate-questions`, { role , experience , mode : interview , resumeText , project , skills } , {withCredentials:true
              })
              // console.log("Generated Questions:", result.data);
              onStart(result.data);
              setLoading(false);
      }

      catch (error) {
        console.error("Error generating questions:", error.response?.data || error.message);
        setLoading(false);
      };

   }
  // ✅ Upload handler (manual only)
  const handleUploadResume = async () => {
    if (!resumeFile || analyzing) return;

    setAnalyzing(true);

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      const result = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/interview/resume`,
        formData,
        { withCredentials: true }
      );

      const projectsData = result.data.projects;
      const skillsData = result.data.skills;

      setRole(result.data.role || "");
      setExperience(result.data.experience || "");

      setProject(
        Array.isArray(projectsData)
          ? projectsData
          : typeof projectsData === "string"
          ? projectsData.split(",")
          : []
      );

      setSkills(
        Array.isArray(skillsData)
          ? skillsData
          : typeof skillsData === "string"
          ? skillsData.split(",")
          : []
      );

      setResumeText(result.data.resumeText || "");
      setAnalysisDone(true);

    } catch (error) {
      console.error("Error analyzing resume:", error.response?.data || error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 px-4'
    >
      <div className='w-full max-w-5xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] grid md:grid-cols-2 overflow-hidden border border-white/30'>

        {/* LEFT */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className='bg-gradient-to-br from-green-100 via-green-50 to-white flex flex-col justify-center p-10 md:p-12'
        >
          <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>
            Start Your AI Interview
          </h2>

          <p className='text-gray-600 mb-8'>
            Practice real interview scenarios powered by AI.
          </p>

          <div className='space-y-4'>
            {[
              { icon: <FaUserTie />, text: "Choose Role & Experience" },
              { icon: <FaMicrophoneAlt />, text: "Smart Voice Interview" },
              { icon: <FaChartLine />, text: "Get Performance Feedback" }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className='flex items-center gap-4 bg-white p-4 rounded-xl shadow'
              >
                <span className='text-green-600'>{item.icon}</span>
                {item.text}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT */}
        <motion.div className='bg-white p-10 space-y-6'>
          <h2 className='text-3xl font-bold'>Ready to Begin?</h2>

          <input
            type="text"
            placeholder='Enter role'
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className='w-full p-3 border rounded-xl'
          />

          <input
            type="text"
            placeholder='Enter experience'
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className='w-full p-3 border rounded-xl'
          />

          <select
            value={interview}
            onChange={(e) => setInterview(e.target.value)}
            className='w-full p-3 border rounded-xl'
          >
            <option value="technical">Technical</option>
            <option value="hr">HR</option>
          </select>

          {/* Upload */}
          {!analysisDone && (
            <div
              onClick={() => document.getElementById("resumeUpload").click()}
              className='border-2 p-6 text-center rounded-xl cursor-pointer hover:bg-green-50 transition'
            >
              <FaFileUpload className='mx-auto text-2xl mb-2' />

              <input
                type='file'
                id='resumeUpload'
                className='hidden'
                accept=".docx"
                onChange={(e) => setResumeFile(e.target.files[0])}
              />

              <p>
                {resumeFile
                  ? `${resumeFile.name} (Ready to analyze)`
                  : "Upload Resume or Paste "}
              </p>

              {resumeFile && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUploadResume();
                  }}
                  disabled={analyzing}
                  className='mt-3 bg-black text-white px-4 py-2 rounded disabled:opacity-50'
                >
                  {analyzing ? "Analyzing..." : "Analyze Resume"}
                </button>
              )}
            </div>
          )}

          {/* RESULTS */}
          {analysisDone && (
            <div className='bg-gray-50 p-4 rounded-xl space-y-4'>

              {skills.length > 0 && (
                <div>
                  <p className='text-sm text-gray-500'>Skills</p>
                  <div className='flex flex-wrap gap-2'>
                    {skills.map((s, i) => (
                      <span key={i} className='bg-green-200 px-2 py-1 rounded'>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.length > 0 && (
                <div>
                  <p className='text-sm text-gray-500'>Projects</p>
                  <ul className='list-disc ml-4'>
                    {project.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          )}

          <button
            onClick={handleStart}
            // { ...console.log(role , experience , loading) }
            disabled={!role || !experience || loading }
            className='w-full bg-green-600 text-white py-3 rounded-xl'
          >
            {loading ? "Generating..." : "Start Interview"}
          </button>

        </motion.div>
      </div>
    </motion.div>
  )
}

export default Step1Setup