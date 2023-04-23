import * as dotenv from 'dotenv'
dotenv.config()

export const TOKEN_CONFIG={
    ATSecret: process.env.AcsTokSecret,
    RTSecret: process.env.RefTokSecret
}