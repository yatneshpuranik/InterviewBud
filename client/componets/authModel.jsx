import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FaTimes } from 'react-icons/fa'
import AuthScreen from '../screen/AuthScreen'
import {motion }from 'motion/react'

const AuthModel = ({onClose}) => {
     const {userData} =  useSelector((state)=>
    
        state.user
    )
    useEffect(() =>
    {
        if(userData)
        {
            onClose()
        }
    }
 , [userData , onClose])
  return (
<div className='fixed inset-0 z-[999] flex items-center justify-center bg-black/10 backdrop-blur-sm px-4'>
        <div className='relative w-full max-w-md'>
            <motion.div
        initial={{opacity:0 , y:-40}}
        animate={{opacity:1 , y:0}}
        transition={{duration:1.05}}>
           <button onClick={onClose} className='absolute top-8 right-5 text-gray-800 hover:text-black text-xl '>
            <FaTimes  size={18} /> 

           </button>
           </motion.div>
           <AuthScreen isModel={true}/>
        </div>
      
    </div>
  )
}

export default AuthModel
