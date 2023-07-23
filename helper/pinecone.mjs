import { create_embedding } from './openai.mjs';
import fs from 'fs'
import { nanoid } from 'nanoid'
import { PineconeClient } from "@pinecone-database/pinecone";

import {
    PINECONE_API_KEY,
    PINECONE_ENVIRONMENT,
    PINECONE_INDEX,
    PINECONE_NAMESPACE
} from '../config/pinecone.mjs'

// Create a client
const pinecone = new PineconeClient();

// Initialize the client
await pinecone.init({
    apiKey: PINECONE_API_KEY,
    environment: PINECONE_ENVIRONMENT,
});



export const insert_single_vector = async (vectors, text) => {
    const index = pinecone.Index(PINECONE_INDEX);
    const upsertRequest = {
        vectors: [
            {
                id: nanoid(),
                values: vectors,
                metadata: {
                    text: text,
                },
            },
        ],
        namespace: PINECONE_NAMESPACE,
    };
    const upsertResponse = await index.upsert({ upsertRequest });
    return upsertResponse
}

export const get_vector_ids = async () => {
    // https://stackoverflow.com/questions/76365604/is-there-a-method-to-fetch-all-the-vectors-of-a-namespace-in-pinecone/76723753#76723753
    const res = await create_embedding("")
    const vectors = res.data[0].embedding
    const res2 = await query_vector(vectors, 10000)
    const ids = res2.map(r => r.id)
    return ids
}

export const query_vector = async (vectors, k) => {
    const index = pinecone.Index(PINECONE_INDEX);
    const queryRequest = {
        vector: vectors, // query vector index
        topK: k, // number of result to return
        includeValues: false, // true to get vector index
        includeMetadata: true, // to get orignal data
        namespace: PINECONE_NAMESPACE,
    };
    // https://docs.pinecone.io/docs/metadata-filtering
    const queryResponse = await index.query({ queryRequest });
    const data = queryResponse.matches.map((eachMatched) => eachMatched)
    return data
}

export const inser_multi_vectors = async (str_arr) => {
    const index = pinecone.Index(PINECONE_INDEX);
    // const questions = JSON.parse(fs.readFileSync('./data/questions.json'))
    // console.log(json);
    console.log('converting all doc into vectors');
    const embededQuestions = str_arr.map(async (str) => {
        const res = await create_embedding(str)

        return {
            id: nanoid(),
            values: res.data.data[0].embedding,
            metadata: {
                text: JSON.parse(res.config.data).input
            },
        }
    })

    const vectoredQuestions = await Promise.all(embededQuestions)
    console.log('converted all doc into vectors');
    // console.log(vectoredQuestions);
    console.log('inserting vector into pinecone');

    const upsertRequest = {
        vectors: vectoredQuestions,
        namespace: PINECONE_NAMESPACE,
    };
    const upsertResponse = await index.upsert({ upsertRequest });
    console.log('inserted vector into pinecone');
    console.log(upsertResponse);
    return upsertResponse
}

export const delete_vectors = async (ids) => {
    const index = pinecone.Index(PINECONE_INDEX);
    await index.delete1({
        ...(ids ? { ids } : { deleteAll: true }),
        namespace: PINECONE_NAMESPACE,
    });
}