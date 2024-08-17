import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import 'dotenv/config'
import defaultPrompt from './prompts/index.ts'

import { PromptTemplate } from "@langchain/core/prompts";

const openAiKey = process.env.OPENAI_API_KEY

const model = new ChatOpenAI({
    model: "gpt-4o",
    configuration: {
        baseURL: "https://api.fe8.cn/v1",
        apiKey: openAiKey
    },
    modelKwargs: {
        "response_format": {
            type: "json_object"
        }
    }
});

const model2 = new ChatOpenAI({
    model: "gpt-4o",
    configuration: {
        baseURL: "https://api.fe8.cn/v1",
        apiKey: openAiKey
    }
});
async function getWebCompelite(userPrompt, dataInfo) {
    let prompt = await PromptTemplate.fromTemplate(defaultPrompt.getWebCompelitePromptTemplate).invoke({ info: dataInfo })
    const messages = [
        new SystemMessage(prompt.toString()),
        new HumanMessage(userPrompt)
    ]
    return await model.invoke(messages);
}

async function getTableCompelite(domStr, dataInfo, inputLoc) {
    let prompt = await PromptTemplate.fromTemplate(defaultPrompt.getTableCompelitePromptTemplate).invoke({ info: dataInfo, inputLoc: inputLoc })
    const messages = [
        new SystemMessage(prompt.toString()),
        new HumanMessage(domStr)
    ]
    return await model2.invoke(messages);
}

async function getReginCompelite(domStr) {
    const messages = [
        new SystemMessage(defaultPrompt.getReginCompelitePromptTemplate),
        new HumanMessage(domStr)
    ]
    return await model.invoke(messages);
}

export { model as llm, getWebCompelite, getTableCompelite, getReginCompelite };



// 测试代码
// const messages = [
//   new SystemMessage("Translate the following from English into Italian"),
//   new HumanMessage("hi!"),
// ];

// let c = await model.invoke(messages);
// console.log(c.content);

// console.log(await getWebCompelite('可以开始了吗','苹果零售店信息'))
// console.log(await getTableCompelite('<div>地址</div>'))