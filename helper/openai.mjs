import { Configuration, OpenAIApi } from "openai";
import { OPENAI_API_KEY } from '../config/openai.mjs'
import { query_vector } from "./pinecone.mjs";

const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration)

const INSTRUCTION = `You are AI assistant at AI2travel, Greet user in friendly way, Answer the question using the provided context below.
If the answer is not contained in the context, say "Sorry, I don't have that information.".`

const template = `
Context: {CONTEXT}
    
Question: {QUERY}

Your Answer: `;

const getPrompt = (context, query) => {
    return template.replace('{CONTEXT}', `${context}`).replace('{QUERY}', `${query}`)
}
const messages = [
    { role: "system", content: INSTRUCTION }
];

export const text_generator = async (context, query) => {
    messages.push({ role: "user", content: getPrompt(context, query) })
    const res = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
    });
    messages.push(res.data.choices[0].message)
    // console.log(messages);
    return messages
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