
import axios from "axios";

const ASSISTANT_API = "http://localhost:5000/api/assistant";

export const sendMessageToAI = async (message) => {
  const response = await axios.post(
    `${ASSISTANT_API}/chat`,
    { message },
    { timeout: 30000 }
  );

  return response.data;
};
