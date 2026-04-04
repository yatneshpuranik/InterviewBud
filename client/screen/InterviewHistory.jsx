import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";

const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getMyInterviews = async () => {
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/interview/get-interviews`,
          { withCredentials: true },
        );
        setInterviews(result.data);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Error fetching interviews:", error);
        }
      }
    };

    getMyInterviews();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-emerald-50 py-10">
      <div className="w-[90vw] lg:w-[70vw] max-w-[90%] mx-auto">
        {/* HEADER */}
        <div className="mb-10 w-full flex items-start gap-4 flex-wrap">
          <button
            onClick={() => navigate("/")}
            className="mt-1 p-3 rounded-full bg-white shadow hover:shadow-md transition"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Interview History
            </h1>
            <p className="text-gray-500 mt-2">
              Track your past interviews and performance reports
            </p>
          </div>
        </div>

        {/* EMPTY STATE */}
        {interviews.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow text-center">
            <p className="text-gray-500">
              No interviews found. Start your first interview.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {interviews.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/report/${item._id}`)}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* LEFT */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.role || "Unknown Role"}
                    </h3>

                    <p className="text-gray-500 text-sm mt-1">
                      {item.experience || "N/A"} • {item.mode || "N/A"}
                    </p>

                    <p className="text-xs text-gray-400 mt-2">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-6">
                    {/* SCORE */}
                    <div className="text-right">
                      <p className="text-xl font-bold text-emerald-600">
                        {item.finalScore ?? 0}/10
                      </p>
                      <p className="text-xs text-gray-400">Overall Score</p>
                    </div>

                    {/* STATUS */}
                    <span
                      className={`px-4 py-1 rounded-full text-xs font-medium ${
                        item.status === "completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : item.status === "aborted"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status || "pending"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewHistory;
