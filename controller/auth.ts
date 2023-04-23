import express from "express";
import {UserService} from "../services/user";
import {Auth} from "../middleware/auth"
import {logger} from "../main"

const authRouter = express.Router()

// Login User
authRouter.post('/api/login', async (req, res) => {
    try {
        const {email} = req.body
        logger.info(email)
        const user = await UserService.RetrieveByEmail(email)
        logger.info(user)
        if (user) {
            const tokens = Auth.GenerateToken(user)
            res.statusCode = 200
            res.json({tokens})
        } else {
            res.statusCode = 404
            res.setHeader("Content-Type", "plain/text")
            res.end("No such User")
        }
    } catch (err) {
        logger.error(err)
        res.statusCode = 500
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify(err))
    }
})

// Refresh User Token
authRouter.post('/api/token', async (req, res) => {
    try {
        const {email, token} = req.body
        logger.info(email)
        const user = await UserService.RetrieveByEmail(email)
        logger.info(user)
        if (user) {
            const newToken = Auth.RefreshToken(token, user)
            res.statusCode = 200
            res.json({newToken})
        } else {
            res.statusCode = 404
            res.setHeader("Content-Type", "plain/text")
            res.end("No such User")
        }
    } catch (err) {
        logger.error(err)
        res.statusCode = 500
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify(err))
    }
})

export {authRouter}