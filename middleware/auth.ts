import {User} from "../model/user";

import {IncomingHttpHeaders} from 'http';

import {Request, Response, NextFunction} from 'express';
import jwt from "jsonwebtoken"

const accessTokenSecret = "mfd10sfk8lj2342fsd"
const refreshTokenSecret = 'gsf340bdf11sk1nl45n';
const refreshTokens: string[] = [];

export function GenerateToken(user: User) {

    const accessToken = jwt.sign(
        {
            email: user?.email,
            firstName: user?.firstName,
            lastName: user?.lastName
        },
        accessTokenSecret,
        {expiresIn: '20m'}
    )

    const refreshToken = jwt.sign(
        {
            email: user?.email,
            firstName: user?.firstName,
            lastName: user?.lastName
        }
        , refreshTokenSecret);
    refreshTokens.push(refreshToken);

    return [accessToken, refreshToken]
}

export const AuthToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader: IncomingHttpHeaders = req.headers;
    if (authHeader.authorization != null) {
        const authHeaderValue: string = authHeader.authorization;
        if (authHeaderValue) {
            const token = authHeaderValue.split(' ')[1];
            jwt.verify(token, accessTokenSecret, (err) => {
                if (err) {
                    return res.status(403).end("Forbidden");

                }
            })
            next()
        }
    } else {
        return res.status(401).end("Unauthorized");
    }
}

export function RefreshToken(token: string, user: User) {
    console.log(token)
    if (!refreshTokens.includes(token)) {
        console.log("err in array")
        return ""
    }

    return jwt.verify(token, refreshTokenSecret, (err) => {
        if (err) {
            console.log(err)
            return ""
        }

        return jwt.sign(
            {
                email: user?.email,
                firstName: user?.firstName,
                lastName: user?.lastName
            },
            accessTokenSecret,
            {expiresIn: '20m'});
    });
}