import axios from 'axios';

const HF_TOKEN = import.meta.env.VITE_AI_TOKEN;
const MODEL_ID = 'mistralai/Mistral-7B-Instruct-v0.2:featherless-ai';
const API_URL = 'https://router.huggingface.co/v1/chat/completions';

export const getAIResponse = async (userMessage, chatHistory, dashboardContext) => {
  if (!HF_TOKEN) {
    return "AI Token is missing. Please add VITE_AI_TOKEN to your .env file.";
  }

  const systemPrompt = `You are a helpful AI assistant for the ISS & News Dashboard. 
Your knowledge is EXCLUSIVELY limited to the following dashboard data:
${JSON.stringify(dashboardContext, null, 2)}

STRICT RULES:
1. ONLY answer questions using the provided data.
2. If the information is not in the data, reply: "I can only answer questions related to the dashboard data."
3. DO NOT use your general knowledge about the world.
4. Keep responses concise and friendly.
5. If asked about the current ISS speed, location, or news headlines, use the context.`;

  // Prepare messages in OpenAI-compatible format
  // Ensure roles alternate correctly: system -> user -> assistant -> user ...
  let historyMessages = chatHistory.slice(-10).map(msg => ({
    role: msg.role === 'assistant' ? 'assistant' : 'user',
    content: msg.content
  }));

  // The first message after system MUST be 'user' for most providers
  if (historyMessages.length > 0 && historyMessages[0].role === 'assistant') {
    historyMessages = historyMessages.slice(1);
  }

  // Final check: filter out any consecutive identical roles (rare but possible if logic changes)
  const filteredHistory = [];
  historyMessages.forEach((msg, i) => {
    if (i === 0 || msg.role !== filteredHistory[filteredHistory.length - 1].role) {
      filteredHistory.push(msg);
    }
  });

  const messages = [
    { role: "system", content: systemPrompt },
    ...filteredHistory,
    { role: "user", content: userMessage }
  ];

  // If the last message before the new user message is also a user message, 
  // we should combine them or remove the old one to maintain alternation.
  if (messages.length >= 2 && messages[messages.length - 1].role === messages[messages.length - 2].role) {
    // This shouldn't happen with the logic above, but safety first
    const lastUserMsg = messages.pop();
    messages[messages.length - 1].content += `\n\n${lastUserMsg.content}`;
  }

  try {
    const response = await axios.post(
      API_URL,
      {
        model: MODEL_ID,
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const answer = response.data.choices?.[0]?.message?.content || "";
    return answer.trim() || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error('Full AI Service Error:', error);
    if (error.response) {
      console.error('Response Data:', error.response.data);
      console.error('Response Status:', error.response.status);
      if (error.response.status === 401) {
        return "Invalid AI Token. Please check your VITE_AI_TOKEN.";
      }
      return `AI Service Error (${error.response.status}): ${error.response.data?.error?.message || 'Check console for details'}`;
    }
    return "Error connecting to the AI service. Please check your connection or API token.";
  }
};
