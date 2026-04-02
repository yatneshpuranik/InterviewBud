import React from 'react'
import { Routes , Route } from 'react-router-dom'
import HomeScreen from '../screen/HomeScreen'
import AuthScreen from '../screen/AuthScreen'
import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import InterviewScreen from '../screen/InterviewScreen'
import InterviewHistory from '../screen/InterviewHistory'
import InterviewReport from '../screen/InterviewReport'
  
const serverUrl = import.meta.env.VITE_SERVER_URL; 
const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const getCurrentUser = async (req , res ) => {
      try {
         const result =  await axios.get(serverUrl+"/api/user/current-user" , {withCredentials : true })
        //  console.log(result.data)
        dispatch(setUserData(result.data))
      } catch (error) {
        // console.log(` error in getting current user is ${error} `)
                dispatch(setUserData(null))

      } 
    }
 getCurrentUser();
},
 [dispatch])
  
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomeScreen/>}/>
        <Route path="/auth" element ={<AuthScreen/>}/>
        <Route path="/interview" element={<InterviewScreen/>}/>
        <Route path="/history" element={<InterviewHistory/>}/>
        <Route path="/report/:id" element={<InterviewReport/>}/>
        

      </Routes>
    </div>
  )
}

export default App
