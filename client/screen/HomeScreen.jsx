import Navbar from '../componets/Navbar'
import { HiSparkles } from 'react-icons/hi'
import { motion }from 'motion/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AuthModel from '../componets/authModel'
import { BsBarChart, BsClock, BsFileEarmark, BsMic, BsRobot } from 'react-icons/bs'
import Footer from '../componets/Footer'

const HomeScreen = () => {
      const[ showAuth , setShowAuth ] = useState(false);
      const {userData} = useSelector((state)=> state.user)
      const navigate = useNavigate();
  return (
    <div className='min-h-screen bg-[#f3f3f3] flex flex-col'>
      <Navbar/>
      <div className = 'flex-1 px-6 py-20'>
        <div className='max-w-6xl mx-auto'>
        <div className='flex justify-center mb-6'>
          <div className='bg-gray-100 text-gray-600 text-md py-4 py-2 rounded-full flex items-center gap-2 '>
            <HiSparkles size={16}  className='bg-green-100 text-green-600'/>
            Ai Powered Smart Mock Interview Platform 
          </div>
          
        </div> 
          
          <div  
           className='text-center mb-28'>
            <motion.h1  initial ={{ opacity : 0 , y : 30 }}
                animate = {{ opacity : 1 , y : 0 }}
                transition = {{duration : 0.6 }} className='text-4xl md:text-6xl font-semibold leading-tight max-w-4xl mx-auto ' >
              Pratice Interview with  
              <span className='relative inline-block'>
              <span className=' text-green-600 px-5 py-1 rounded-full '>
                 Ai Intelligence 
              </span>
            </span>
            </motion.h1>
            <motion.p 
            initial={{opacity : 0 }}
            animate={{opacity: 1 }}
            transition={{duration:0.8}}
            className='text-gray-500 mt-6 max-w-2xl mx-auto text-lg'>

                   Role based mock interview with smart follow-ups adaptive difficulty and real-time perfomance evaluation 

            </motion.p>
            <div className='flex flex-wrap justify-center gap-4 mt-10 '>
              <motion.button onClick={()=>
                {
                  if(!userData)
                  {
                    setShowAuth(true)
                    return
                  }
                  navigate('/interview')
                }
              
              }
              whileHover = {{ opacity : 1 , scale : 1.03}}
              whileTap = {{ opacity: 0.8 , scale : 0.98 }}
              
              className='bg-black text-white px-10 py-3 rounded-full hover:opacity-90 shadow-md'>
                 Start Interview
              </motion.button> 
               <motion.button onClick={()=>
                {
                  if(!userData)
                  {
                    setShowAuth(true)
                    return
                  }
                  navigate('/history')
                }
              
              }
              whileHover = {{ opacity : 0.9 , scale : 1.03}}
              whileTap = {{ opacity: 1 , scale : 0.98 }}
              
              className='border border-gray-300 px-10 py-3 rounded-full hover:bg-gray-100 transition'>
                 History
              </motion.button> 
 

            </div>
          </div> 
          <div className='flex flex-col md:flex-row justify-center items-center gap-10 mb-28'>
            {
              [
                { 
                  icon: <BsRobot size={24}/>,
                  step : "STEP 1",
                  title : " Role & Experience Selection",
                  desc : "AI adjusts difficulty based on selected job role ."
                },
                {
                  icon: <BsMic size={24}/>,
                  step : "STEP 2",
                  title : "Smart Voice Interview ",
                  desc : "Dynamic follow-up based on your answers"
                },
                {
                  icon: <BsClock size={24} />,
                  step : "STEP 3",
                  title : "Timer Based Simulation",
                  desc : "Real interview pressure with time tracking functionality ."
                }
              ].map((item ,index ) =>
              (<motion.div key ={index} 
                initial= {{ opacity : 0 , y : 60 }}
                whileInView={{opacity: 1 , y : -40  }}
                transition={{ duration : 0.6 + index * 0.2 }}
                whileHover={{ scale : 1.06 , rotate : 0 }}
                className ={ ` bg-white rounded-3xl border-2 border-green-100 hover: border-green-500 p-10 w-80 max-w-[90%] shadow-md hover:shadow-2xl transition-all duration-300   
                  
                 `}>
                  {/* <div className='absolute -top-8 left-1/2 -translate-x-1/2 bg-white border-2 border-green-500 text-green-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg'>
                       {item.icon}
                  </div> */}
                  <div className='pt-10 text-center'>
                    <div className='absolute -top-8 left-1/2 -translate-x-1/2 bg-green-200 border-2 border-green-500 text-black  w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg '>
                       {item.icon}
                  </div>
                    <div className='text-xs text-green-600 font-semibold mb-2 tracking-wider'>
                        {item.step}
                    </div>
                    <h3 className=' font-semibold mb-3 text-lg'>
                       {item.title}
                    </h3>
                    <p className='text-sm text-gray-500 leading-relaxed'>
                        {item.desc}
                    </p>

                  </div>
                </motion.div>
              ))
            }

          </div>
          <div className='mb-32'>
            <motion.h2 initial={{opacity:0 , y : 20 }}
            whileInView={{opacity: 1 , y : 0 }}
            transition={{duration : 0.6 }}
             className='text-4xl font-semibold text-center mb-16'>
              Advanced AI {" "}
              <span className='text-green-600 '> Features </span>

            </motion.h2>
            <div className='grid md:grid-cols-2 gap-10'>
            {
              [
                { image : "../src/assets/ai-ans.png",
                  icon: <BsBarChart size={20} />,
                  title : "AI Evaluated Answers",
                  desc : "Provide score on basis of communication , technical accuracy and confidence."
                },
                { image : "../src/assets/resume.png",
                  icon: <BsFileEarmark size={20} />,
                  title : "Resume Based Interview",
                  desc : "Technical questions on basis of project you have mentioned "
                },
                { image : "../src/assets/pdf.png",
                  icon: <BsFileEarmark size={20} />,
                  title : "Download Reports",
                  desc : "Detailed analysed report remarking weakness and strength."
                },
                { image : "../src/assets/history.png",
                  icon: <BsBarChart size={20} />,
                  title : "Analytics & History",
                  desc : "Keeps tracks of progress in graphical representation."
                }
              ].map((item , index )=> (
                     <motion.div 
                     initial={{opacity:0 , y : 30 }}
                     whileInView={{opacity: 1 , y : 0 }}
                     transition={{duration : 0.5 , delay : index * 0.1}}
                     whileHover={{scale:1.02}}
                     key={index} className='bg-color-white border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transistion-all'>
                       
                       <div className='flex flex-col md:flex-row items-center gap-8'>
                          <div className='w-full md:w:-1/2 flex justify-center'>
                          <img src={item.image} alt= {item.title} className='w-full h-auto object-contain max-h-64'/>
                          </div>
                          <div className='w-full md:w-1/2'>
                               <div className='bg-green-50 text-green-600 w-12 h-1 rounded-xl flex items-center justify-center mb-6'> 
                               {item.icon}
                               </div>
                               <h3 className='font-semibold mb-3 text-xl'>
                                 {item.title}
                               </h3>
                               <p className='text-gray-500 text-sm leading-relaxed'>
                                  {item.desc}
                               </p>
                          </div>
                       </div>

                     </motion.div>
              ))
            }
            </div>
          </div>
          <div className='mb-32'>
            <motion.h2 initial={{opacity:0 , y : 20 }}
            whileInView={{opacity: 1 , y : 0 }}
            transition={{duration : 0.6 }}
             className='text-4xl font-semibold text-center mb-16'>
              Multiple Interview {" "}
              <span className='text-green-600 '> Modes </span>

            </motion.h2>
            <div className='grid md:grid-cols-2 gap-10'>
            {
              [
                { image : "../src/assets/HR.png",
                  
                  title : "HR Interview",
                  desc : "Evaluate on  communication and behavior"
                },
                { image : "../src/assets/tech.png",
            
                  title : "Technical Interview",
                  desc : "Deep technical questioning based on selected role"
                },
                { image : "../src/assets/confi.png",
                  title : "Confidence Analyzer",
                  desc : "Basic tone and voice analysis insight"
                },
                {
                image : "../src/assets/ai.png",
                title : "AI Feedback Engine",
                desc : "Get instant improvement suggestions after each interview"
                }
              ].map((item , index )=> (
                     <motion.div 
                     initial={{opacity:0 , y : 30 }}
                     whileInView={{opacity: 1 , y : 0 }}
                     transition={{duration : 0.5 , delay : index * 0.1}}
                     whileHover={{y : -6 }}
                     key={index} className='bg-white border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transistion-all'>
                       
                       <div className='flex  items-center justify-center gap-6'>
                          <div className='w:-1/2'>
                               <h3 className='font-semibold mb-3 text-xl'>
                                 {item.title}
                               </h3>
                                <p className='text-gray-500 text-sm leading-relaxed'>
                                  {item.desc}
                               </p>
                          </div>
                          <div className='w-1/2 flex justify-end'>
                               {/* <div className='bg-green-50 text-green-600 w-12 h-1 rounded-xl flex items-center justify-center mb-6'> 
                               {item.icon}
                               </div> */}

                              <img src={item.image} alt= {item.title} className='w-28 h-28 object-contain max-h-64'/>

                              
                              
                          </div>
                       </div>

                     </motion.div>
              ))
            }
            </div>
          </div>
        </div>
      </div>
      { showAuth &&  <AuthModel  onClose={() => setShowAuth(false)}/>  }
        <Footer/>
    </div>
  )
}

export default HomeScreen


// ${index == 0 ? "rotate-[-4deg]" : ""}
//                   ${index == 1 ? "rotate-[3deg] md:-mt-6 shadow-xl"  : ""}
//                   ${index == 2 ? "rotate-[-3deg]" : ""} 