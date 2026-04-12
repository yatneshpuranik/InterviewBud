import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from "axios"
import Step3Report from '../componets/Step3Report'

function InterviewReport() {
  const { id } = useParams()
  const [report, setReport] = useState(null)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/interview/report/${id}`,
          { withCredentials: true }
        )

        setReport(result.data)
      } catch (error) {
        console.error("Error fetching report:", error)
      }
    }

    if (id) fetchReport()
  }, [id])

  
  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">
          Loading Report...
        </p>
      </div>
    )
  }


  return <Step3Report report={report} />
}

export default InterviewReport