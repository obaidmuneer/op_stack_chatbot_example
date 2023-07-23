import 'dotenv/config'

if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX) {
    throw new Error('Missing PINECONE_API_KEY or PINECONE_INDEX key ')
}

export const { PINECONE_API_KEY, PINECONE_ENVIRONMENT, PINECONE_INDEX, PINECONE_NAMESPACE } = process.env
