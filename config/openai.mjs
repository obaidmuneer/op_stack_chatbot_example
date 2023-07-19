import 'dotenv/config'

if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY key ')
}

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY
