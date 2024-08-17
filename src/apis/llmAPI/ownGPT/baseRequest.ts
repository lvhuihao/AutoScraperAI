import fetch from 'node-fetch'; // 如果你在Node.js环境中使用fetch，需要先安装并引入node-fetch

/**
 * @description 封装gpt请求
 */
class Chat {
    completions: Complete | null = null;
    constructor(key, url, model) {
        this.completions = new Complete(key, url, model);
    }
}

/**
 * 
 */
class Complete {
    apiKey: string;
    url: string;
    model: string;
    constructor(key, url, model) {
        this.apiKey = key;
        this.url = url;
        this.model = model;
    }

    create({ model, messages, response_format }) {
        return this.fetchCompletion(model, messages, response_format);
    }
    async fetchCompletion(model, messages, response_format) {
        let result;
        try {
            // console.log(this.url);
            // console.log(this.apiKey)
            const response = await fetch(this.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: model || this.model,
                    messages: messages,
                    response_format: response_format

                })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            result = await response.json();
            // console.log(result);
        } catch (error) {
            console.error('Error:', error);
        }
        return result;
    };
}

class OpenAI {
    apiKey: string = '';
    baseUrl: string = '';
    chat: Chat | null = null;
    constructor({ apiKey, baseURL }: { apiKey: string, baseURL: string }) {
        this.apiKey = apiKey;
        this.baseUrl = baseURL;
        this.chat = new Chat(this.apiKey, this.baseUrl + '/chat/completions', "gpt-3.5-turbo");
    }
}

export default OpenAI;


/**
 * 测试OpenAI API
 */
// let openai = new OpenAI({
//     apiKey: "sk-L83be38tnyEJum5WapxMGKCdaTPbGpwb4XTYwowl9ySK3uYd",
//     baseURL: "https://api.fe8.cn/v1"
// })
// // console.log(openai)
// openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     messages: [
//         {
//             role: 'system',
//             content: 'You are a helpful assistant.'
//         },
//         {
//             role: 'user',
//             content: 'Who won the world series in 2020?'
//         }
//     ]
// }).then(res => {
//     console.log(res);
// })