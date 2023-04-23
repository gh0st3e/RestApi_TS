import {User} from "../model/user";
import {logger} from "../main"
import {TOKEN_CONFIG} from "../config/token.config"

import {IncomingHttpHeaders} from 'http';

import {Request, Response, NextFunction} from 'express';
import jwt from "jsonwebtoken"

const accessTokenSecret = TOKEN_CONFIG.ATSecret!
const refreshTokenSecret = TOKEN_CONFIG.RTSecret!
const refreshTokens: string[] = [];
const TokenLifeTime = '20m'

// Generate new token.
export const GenerateToken = (user: User) => {

    const accessToken = jwt.sign(
        {
            email: user?.email,
            firstName: user?.firstName,
            lastName: user?.lastName
        },
        accessTokenSecret,
        {expiresIn: TokenLifeTime}
    )

    const refreshToken = jwt.sign(
        {
            email: user?.email,
            firstName: user?.firstName,
            lastName: user?.lastName
        }
        , refreshTokenSecret);
    refreshTokens.push(refreshToken);

    return [accessToken, '', refreshToken]
}

// Validate access token.
export const AuthToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader: IncomingHttpHeaders = req.headers;
    if (authHeader.authorization != null) {
        const authHeaderValue: string = authHeader.authorization;
        if (authHeaderValue) {
            const token = authHeaderValue.split(' ')[1];
            jwt.verify(token, accessTokenSecret, (err) => {
                if (err) {
                    res.setHeader("Content-Type", "application/json")
                    return res.status(403).end(JSON.stringify("Forbidden"));
                } else {
                    next()
                }
            })

        }
    } else {
        res.setHeader("Content-Type", "application/json")
        return res.status(401).end(JSON.stringify("Unauthorized"));
    }
}

// Refresh access token with refresh token.
export const RefreshToken = (token: string, user: User) => {
    logger.info(token)
    if (!refreshTokens.includes(token)) {
        logger.warn("No Such Refresh Token")
        return ""
    }

    return jwt.verify(token, refreshTokenSecret, (err) => {
        if (err) {
            logger.warn(err)
            return ""
        }

        return jwt.sign(
            {
                email: user?.email,
                firstName: user?.firstName,
                lastName: user?.lastName
            },
            accessTokenSecret,
            {expiresIn: TokenLifeTime});
    });
}

export const Auth = {
    GenerateToken,
    RefreshToken,
    AuthToken
}