import { Configuration, OpenAIApi } from "openai";
import { OPENAI_API_KEY } from '../config/openai.mjs'
import { query_vector } from "./pinecone.mjs";

const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration)

const INSTRUCTION = `You are an AI assistant at AI2travel, and your primary goal is to help users by answering their questions in a friendly and conversational manner. The user's question will be presented within triple quotes for clarity.

Before providing an answer, you should first analyze whether the user's question is related to the given context or the chat history. If the question is related to the context, answer it based on the provided information in the "Context" section. If the question is related to the chat history, answer it accordingly based on the past conversation provided in the "Chat History" section.

If the user's question is not covered by the context or the chat history, respond with "Sorry, I don't have that information."

Please note that the chat history will be enclosed in angle brackets, "< >", and the context will be enclosed in braces, "{ }".`

const template = `**Context:** {CONTEXT}

**Chat History:** {CHAT_HISTORY}

**Question:** {QUERY}

**Your Answer in markdown:**
`

const getPrompt = (context, query, chat_history) => {
    return template.replace('{CONTEXT}', `{${context}}`).replace('{QUERY}', `'''${query}'''`).replace('{CHAT_HISTORY}', `<\n${chat_history}>`)
}

const history = []

// const messages = [
//     { role: "system", content: INSTRUCTION }
// ];

export const text_generator = async (context, query) => {
    const messages = [
        { role: "system", content: INSTRUCTION }
    ];

    let chat_history = ''

    history.forEach(([query, ans]) => {
        chat_history += `user: ${query} \nassistant: ${ans} \n`
    })

    messages.push({ role: "user", content: getPrompt(context, query, chat_history) })

    const res = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
    });
    history.push([query, res.data.choices[0].message.content])
    // messages.push(res.data.choices[0].message)
    console.log(messages);
    // console.log(chat_history);
    return res.data.choices[0].message.content
}

export const create_embedding = async (text) => {
    const res = await openai.createEmbedding({
        model: 'text-embedding-ada-002',
        input: text
    })
    return res
}

export const chain = async (query, k = 2) => {
    const res = await create_embedding(query)

    const queryVectors = res.data.data[0].embedding
    const vectors = await query_vector(queryVectors, k)

    const context = vectors.map(v => v.metadata.text).join(" ")
    const text_gen = await text_generator(context, query)

    return text_gen
}