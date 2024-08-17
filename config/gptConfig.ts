import 'dotenv/config';
export default {
    model: "gpt-4o",
    baseURL: process.env.OPENAI_API_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY
}