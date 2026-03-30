import axios from 'axios'

export const askAi  = async (message) => 
{
    try {
        if( !message || !Array.isArray(message) || message.length === 0 )
        {
            throw new Error (" Message Array is empty")
        }

        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions" , 
            {
                model : "openai/gpt-40-mini",
                message : message
            },
            {
                headers :
                {
                    Authorization : `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type' : 'application/json'
                }
            }
        )

        const content = response?.data?.choice[0]?.message?.content
        if( !content || !content.trim())
        {
            throw new Error("Content is Empty ")

        }
        return content 
    } catch (error) {
        console.error("open router error " ,  error.response?.data || error.message )
        throw new Error("Open Router Api Error ")
    }
    
}