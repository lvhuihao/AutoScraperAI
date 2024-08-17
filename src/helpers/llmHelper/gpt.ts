import OpenAI from '../../apis/llmAPI/ownGPT/baseRequest.ts';
import { prompt as basePrompt } from './prompt.ts';
const openai = new OpenAI(
    {
        apiKey: "sk-45RRNvyRnrbYGPDenj5jrmUIEGNlqxBBuVxlzSktwYadhIbJ",
        baseURL: "https://api.fe8.cn/v1"
    }
);
let prompt = [basePrompt]

async function getCompelite(usePrompt?: string) {
    if (usePrompt) {
        prompt.push({
            'role': 'user',
            'content': `${usePrompt}`
        })
    }
    const completion = await openai.chat?.completions?.create({
        messages: prompt,
        model: "gpt-4o",
        response_format: { "type": "text" }
    });
    // console.log(completion)
    prompt.push(completion.choices[0].message)
    // console.log(prompt)
    return completion.choices[0].message.content
}

function cleanPrompt() {
    prompt = [basePrompt]
}

export { getCompelite, cleanPrompt }

/**
 * 测试getComplite方法
 */
// getCompelite().then((res) => {
//     console.log(res)
// }).then(()=>{
//     return getCompelite("唯见长江天际流")
// }).then(res=>{
//     console.log(res)
// })
