// This file contains functions to call the Groq AI API.
export const evaluateUnderstanding = async (text: string): Promise<string> => {
    // Replace with your actual API endpoint and secure API key.
    const apiUrl = "https://api.groq.com/openai/v1/chat/completions";
    const apiKey = process.env.REACT_APP_GROQ_AI_API_KEY;; 
  
    if (!apiUrl || !apiKey) {
      throw new Error("Groq AI API URL or API key is not defined.");
    }
  
    // Construct a prompt to perform SWOT analysis and provide detailed feedback.
    const prompt = `Evaluate the following explanation of a topic using SWOT analysis.
  Provide detailed feedback including:
  - **Strengths:** What are the strong points of this explanation?
  - **Weaknesses:** What areas need improvement?
  - **Opportunities:** What further aspects can be explored to enhance understanding?
  - **Threats:** What potential misunderstandings or issues might arise?
  Additionally, highlight the key points and offer actionable suggestions for improvement.
  
  Explanation:
  ${text}`;
  
    const payload = {
      model: "llama3-8b-8192", // Using a free-tier model
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7
    };
  
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to evaluate understanding from Groq AI API: ${errorText}`);
    }
  
    const data = await response.json();
    // Assumes the API returns the evaluation in data.choices[0].message.content
    return data?.choices?.[0]?.message?.content || "";
  };
  