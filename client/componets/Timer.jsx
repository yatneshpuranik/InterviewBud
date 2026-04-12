import React from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

const Timer = ({ timeLeft = 30, totalTime = 60 }) => {
  const percentage = (timeLeft / totalTime) * 100

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      
    
      <div className="w-28 h-28 p-2 rounded-full bg-emerald-50 shadow-inner">
        
        <CircularProgressbar
          value={percentage}
          text={`${timeLeft}s`}
          strokeWidth={10}
          styles={buildStyles({
            strokeLinecap: 'round',
            pathTransitionDuration: 0.6,
            pathColor: `rgb(16, 185, 129)`,
            textColor: `#111827`,
            trailColor: `#e5e7eb`,
            textSize: '20px',
          })}
        />
      </div>

  
      <p className="text-xs text-gray-500">
        Time Remaining
      </p>

    </div>
  )
}

export default Timer