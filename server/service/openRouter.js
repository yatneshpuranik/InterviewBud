import axios from "axios";

export const askAi = async (messages) => {
  try {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("Message array is empty");
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini", // ✅ fixed
        messages: messages, // ✅ FIXED (plural)
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response?.data?.choices?.[0]?.message?.content; // ✅ FIXED

    if (!content || !content.trim()) {
      throw new Error("Content is empty");
    }

    return content;

  } catch (error) {
    console.error("open router error", error.response?.data || error.message);
    throw new Error("Open Router Api Error");
  }
};