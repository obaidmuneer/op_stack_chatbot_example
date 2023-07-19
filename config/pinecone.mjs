import 'dotenv/config'

if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX) {
    throw new Error('Missing PINECONE_API_KEY or PINECONE_INDEX key ')
}

export const PINECONE_API_KEY = process.env.PINECONE_API_KEY
export const PINECONE_ENVIRONMENT = process.env.PINECONE_ENVIRONMENT
export const PINECONE_INDEX = process.env.PINECONE_INDEX
export const PINECONE_NAMESPACE = process.env.PINECONE_NAMESPACE
