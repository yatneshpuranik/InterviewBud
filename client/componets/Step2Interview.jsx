import React, { useState , useRef, useEffect } from 'react'
import femaleVideo from "../src/assets/videos/female-ai.mp4"
import maleVideo from "../src/assets/videos/male-ai.mp4"
import Timer from './Timer';
import {motion} from "motion/react"
import { FaArrowLeft, FaArrowRight, FaMicrophone , FaMicrophoneSlash } from "react-icons/fa"
import axios from "axios"
// import { finishInterview } from '../../server/controller/interviewController';

const Step2Interview = ({ interviewData , onFinish }) => {
      const { interviewId , questions , userId , userName} = interviewData;
      const [isIntro , setIsIntro] = useState(true);
      const [isTimerRunning, setIsTimerRunning] = useState(false);
      const [isFeedbackPlaying, setIsFeedbackPlaying] = useState(false);
      const [ismicOn , setIsMicOn] = useState(true);
      const [isAiPlaying , setIsAiPlaying] = useState(false);
      const recognitionRef = useRef(null);
      const [currentQuestionIndex , setCurrentQuestionIndex] = useState(0);
      const [answer , setAnswer] = useState("");
      const [feedback , setFeedback] = useState("");
      const [timeleft , setTimeLeft] = useState(questions[currentQuestionIndex].timeLimit || 60);
      const [selectVoice , setSelectVoice] = useState(null);
      const [isSubmitting , setIsSubmitting] = useState(false);
      const [voiceGender , setVoiceGender] = useState("female");
      const [subtitle , setSubtitle] = useState("");
      const videoRef = useRef(null);
      const currentQuestion = questions[currentQuestionIndex];


      useEffect(() => {

         const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            if(!voices.length ) return;

            const femaleVoice = voices.find(voice => voice.name.toLowerCase().includes("female") )|| voices.find(voice => voice.name.toLowerCase().includes("zira") ) || voices.find(voice => voice.name.toLowerCase().includes("samantha") ) 
            if(femaleVoice)
            {
                setSelectVoice(femaleVoice);  
                setVoiceGender("female");
                return ;
            }

            const maleVoice = voices.find(voice => voice.name.toLowerCase().includes("male") ) || voices.find(voice => voice.name.toLowerCase().includes("david") ) || voices.find(voice => voice.name.toLowerCase().includes("mark") )
            if(maleVoice)
            {
                setSelectVoice(maleVoice);  
                setVoiceGender("male");
                return ;
            } 
            


            setSelectVoice(voices[0]);
            setVoiceGender("female");
            }
            loadVoices();
            window.speechSynthesis.onvoiceschanged = loadVoices;

      } ,[] );


      const videoSource =  voiceGender === "male" ? maleVideo : femaleVideo ; 


      const speakText = (text) => {
  return new Promise((resolve) => {
    if (!selectVoice || !window.speechSynthesis) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel();

    const humanizeText = text
      .replace(/,/g, ",...")
      .replace(/\./g, ". ...");

    const utterance = new SpeechSynthesisUtterance(humanizeText);

    utterance.voice = selectVoice;
    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    // ✅ SAFE DETECTION
    const isFeedbackSpeech = !!feedback && text === feedback;

    utterance.onstart = () => {
      setIsAiPlaying(true);

      if (isFeedbackSpeech) {
        setIsFeedbackPlaying(true);
      }

      setIsTimerRunning(false);
      StopMic();
      videoRef.current?.play();
    };

    utterance.onend = () => {
      videoRef.current?.pause();
      videoRef.current.currentTime = 0;

      setIsAiPlaying(false);
      setIsFeedbackPlaying(false);

      if (!isFeedbackSpeech) {
        setTimeLeft(currentQuestion.timeLimit || 60);
        setIsTimerRunning(true);
      }

      if (ismicOn && !isFeedbackSpeech) {
        StartMic();
      }

      setTimeout(() => {
        setSubtitle("");
        resolve();
      }, 300);
    };

    setSubtitle(text);
    window.speechSynthesis.speak(utterance);
  });
};

    useEffect(() => {
        if(!selectVoice) return ;
        const runInterview = async () => {
            if(isIntro)
            {
                await speakText(
    `Hello ${userName}, welcome to your interview.  My name is Zira , I am your AI interviewer , I will be asking you a series of questions.`
  );

  await new Promise((r) => setTimeout(r, 600));

  await speakText(`Let's start with the first question.`);

  setIsIntro(false); 

  await speakText(currentQuestion.question);
  if (ismicOn)
  {
    StartMic();
  }
            }
            else if (currentQuestion) {
              await new Promise ((r) => setTimeout(r, 800));
              if ( currentQuestionIndex === questions.length - 1 )
              {
                await speakText(`Alright , This question is might be , a bit challenging for you ${userName}`)
              }
            
                await speakText(`${currentQuestion.question}`);
                if (ismicOn)
                {
                  StartMic();
                }
            }

        }

        runInterview()

    },[selectVoice , isIntro , currentQuestionIndex ]);

  
 const increaseIndex = async() =>
{
  setIsTimerRunning(false);
  setAnswer("");
  setFeedback("");

  if (currentQuestionIndex+1 >= questions.length)
  {
    return ;
  }

  setCurrentQuestionIndex(currentQuestionIndex+1);
}
  

  useEffect (()=>{
    if(isIntro) return ;
    if(!currentQuestion) return ;
    if( timeleft === 0 && !isSubmitting && !feedback)
    {
      submitAnswer();
    }
  } , [timeleft])
  

  useEffect(()=>{
    return ()=>
    {
      if (recognitionRef.current)
      {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }
      window.speechSynthesis.cancel();
    }
  } , [])

  const finishInterview = async () =>
  {
    StopMic();
    setIsMicOn(false);
    try {
      const result = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/interview/finish` ,{interviewId} , {withCredentials: true })
      console.log(result.data)
      onFinish(result.data)

    } catch (error) {
      console.log(error)
    }
  }
//   useEffect(() => {
//   if (isIntro || isAiPlaying) return;
//   if (!currentQuestion) return;
//   if(isSubmitting) return ; 

//   // reset timer when new question starts
//   setTimeLeft(currentQuestion.timeLimit || 60);

//   const timer = setInterval(() => {
//     setTimeLeft((prev) => {
//       if (prev <= 1) {
//         clearInterval(timer);
//         return 0;
//       }
//       return prev - 1;
//     });
//   }, 1000);

//   return () => clearInterval(timer);
// }, [isIntro, isAiPlaying, currentQuestionIndex , isSubmitting]);

useEffect(() => {
  if (!isTimerRunning) return;

  const timer = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        clearInterval(timer);
        setIsTimerRunning(false);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [isTimerRunning]);
useEffect(() => {
  if (!("webkitSpeechRecognition" in window)) return;

  const recognition = new window.webkitSpeechRecognition();

  recognition.lang = "en-US";
  recognition.continuous = true;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const transcript =
      event.results[event.results.length - 1][0].transcript;
    setAnswer((prev) => prev + " " + transcript);
  };

  // 🔥 KEY FIX: auto-restart mic
  recognition.onend = () => {
    if (ismicOn && !isAiPlaying) {
      try {
        recognition.start();
      } catch {}
    }
  };

  recognitionRef.current = recognition;
}, []);



const StartMic = () => {
  if (recognitionRef.current && !isAiPlaying) {
    try {
      recognitionRef.current.start();
    } catch (e) {
      // already started ignore
    }
  }
};

const StopMic = () =>
{
  if (recognitionRef.current)
  {
    recognitionRef.current.stop();
  }
}


const toggleMic =() =>
{
  if (ismicOn)
  {
    StopMic();
  }
  else 
  {
    StartMic();
  }

  setIsMicOn(!ismicOn)
}

const submitAnswer = async () => {
  if (isSubmitting) return;

  setIsTimerRunning(false);
  StopMic();
  setIsSubmitting(true);

  try {
    let result = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/interview/submit-answers`,
      {
        interviewId,
        questionIndex: currentQuestionIndex,
        answer,
        timeTaken: currentQuestion.timeLimit - timeleft,
      },
      { withCredentials: true }
    );

    const feedbackText = result.data.feedback;
    setFeedback(feedbackText);

    setTimeout(async () => {
      await speakText(feedbackText);

      // ✅ CHECK IF LAST QUESTION
      if (currentQuestionIndex + 1 >= questions.length) {
        finishInterview(); // only here
      } else {
        increaseIndex();
      }

      setIsSubmitting(false);
    }, 100);

  } catch (error) {
    console.log(error);
    setIsSubmitting(false);
  }
};


  return (
   <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-100 flex items-center justify-center p-4 sm:p-6">
  <div className="w-full max-w-6xl min-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-hidden">

    {/* LEFT */}
    <div className="w-full lg:w-[40%] bg-white flex flex-col items-center p-6 space-y-6 border-r border-gray-200">
      
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl">
        <video
          src={videoSource}
          key={videoSource}
          ref={videoRef} 
          muted
          playsInline
          preload="auto"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* subtitle */}

      {subtitle && (
        <div className="w-full max-w-md bg-gray-50 border border-gray-200 rounded-xl shadow-sm p-4 ">
          <p className='tex-gray-700 text-sm sm:text-base font-medium leading-relaxed text-center'>
            {subtitle}
          </p>
        </div>
      )}

      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-5">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Interview Status
          </span>
          { isAiPlaying && 
            <span className="text-sm font-semibold text-emerald-600">
              { isAiPlaying ? "AI is Speaking..." : "" }
            </span>
          }
        </div>

        <div className="h-px bg-gray-200" />

        <div className="flex justify-center">
          {
           !isIntro && !isAiPlaying && !isFeedbackPlaying && (
          <Timer timeLeft={timeleft} totalTime={currentQuestion?.timeLimit || 60} /> )
          }
        </div>
        <div className='h-px bg-gray-200'>

        </div>
        <div className='grid grid-cols-2 gap-6 text-center'>
          <div>
            <span className='text-2xl font-bold text-emerald-500'>
               {currentQuestionIndex+1}
            </span>
            <span className='text-sm text-gray-500'>
                 Question

            </span>
          </div>
          <div>
              <span className='text-2xl font-bold text-emerald-500'>
               {questions.length}
              </span>
              <span className='text-sm text-gray-500'>
               Total Questions 
              </span>
          </div>
        </div>
      </div>
    </div>

    {/* RIGHT */}
    <div className="flex-1 flex flex-col p-4 sm:p-6 md:p-8">
  
  <h2 className="text-xl sm:text-2xl font-bold text-emerald-800 mb-6">
    AI Interview
  </h2>

     <div className="flex flex-col flex-1 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">

  
      {!isIntro && (
  <p className="text-xs sm:text-sm text-gray-400 mb-2">
    Question {currentQuestionIndex + 1} of {questions.length}
  </p>
)}
   {!isIntro && (
  <div className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
    {currentQuestion?.question}
  </div>
)}

    {/* TEXTAREA (EXPANDS FULL) */}
    <textarea
      placeholder="Type your answer here..."
      onChange={(e) => setAnswer(e.target.value)}
      value ={answer}
      className="flex-1 w-full bg-gray-200 p-4 sm:p-6 rounded-2xl resize-none outline-none border border-gray-200 focus:ring-2 focus:ring-emerald-500 transition text-gray-800"
    />

    {/* BUTTONS (STICK TO BOTTOM) */}
    { !feedback ? (<div className="flex items-center gap-4 mt-6">
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-black text-white rounded-full shadow-lg"
        onClick={toggleMic}
      >
        {ismicOn ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
      </motion.button>

      <motion.button
        onClick={submitAnswer}
        disabled={isSubmitting}
        whileTap={{ scale: 0.95 }}
        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 md:py-4 rounded-2xl shadow-lg hover:opacity-90 transition font-semibold disabled : bg-gray-400"
      >
         {isSubmitting ?  "Submitting...": "Submit Answer"}      </motion.button>

    </div>) : ( 
      <motion.div 
      initial={{opacity : 0 }}
      animate={{opacity:1}}
      className='mt-6 bg-emerald-50 border border-emerald-200 p-5 rounded-2xl shadow-sm'>
       <p className='text-emerald-700 font-medium mb-4 '> {feedback}</p>
       <button  onClick={increaseIndex} className='w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 shadow-md hover:opacity-90 transition flex item-center justify-center gap-1'>Next Question <FaArrowRight size={18}/></button>
      </motion.div>
    )}
  </div>
  </div>

  </div>
</div>
  )
}

export default Step2Interview
