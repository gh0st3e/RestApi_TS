import {User} from "../model/user";
import {Auth} from "../middleware/auth";
import {UserService} from "../services/user"

import express from "express";

const userRouter = express.Router()

// Get all users route.
userRouter.get("/api/users", Auth.AuthToken, async (req, res) => {
    try {
        const users = await UserService.RetrieveAll()
        res.statusCode = 200
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify(users))
    } catch (err) {
        res.statusCode = 500
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify(err))
    }
})

// Get user by email route.
userRouter.get("/api/user/:email", Auth.AuthToken, async (req, res) => {
    try {
        const email: string = req.params.email;
        const user = await UserService.RetrieveByEmail(email)
        if (user) {
            res.statusCode = 200
            res.setHeader("Content-Type", "application/json")
            res.end(JSON.stringify(user))
        } else {
            res.statusCode = 404
            res.setHeader("Content-Type", "application/json")
            res.end(JSON.stringify(`No Such User`))
        }
    } catch (err) {
        res.statusCode = 500
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify(err))
    }
})

// Insert user route.
userRouter.post("/api/user", async (req, res) => {
    try {
        const user: User = JSON.parse(JSON.stringify(req.body));
        const inserted = await UserService.Insert(user)
        if (inserted) {
            res.statusCode = 200
            res.setHeader("Content-Type", "application/json")
            res.end(JSON.stringify(inserted))
        } else {
            res.statusCode = 400
            res.setHeader("Content-Type", "application/json")
            res.end(JSON.stringify(`Fill The Data`))
        }
    } catch (err) {
        res.statusCode = 500
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify(err))
    }
})

// Update user route.
userRouter.put("/api/user", Auth.AuthToken, async (req, res) => {
    try {
        const user: User = JSON.parse(JSON.stringify(req.body));
        const updated = await UserService.Update(user)
        if (updated) {
            res.statusCode = 200
            res.setHeader("Content-Type", "application/json")
            res.end(JSON.stringify("Successfully Updated"))
        } else {
            res.statusCode = 400
            res.setHeader("Content-Type", "application/json")
            res.end(JSON.stringify(`Fill The Data`))
        }
    } catch (err) {
        res.statusCode = 500
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify(err))
    }
})

// Delete user route.
userRouter.delete("/api/user/:email", Auth.AuthToken, async (req, res) => {
    try {
        const email: string = req.params.email;
        const deleted = await UserService.Delete(email)
        if (deleted) {
            res.statusCode = 200
            res.setHeader("Content-Type", "application/json")
            res.end(JSON.stringify("Successfully Deleted"))
        } else {
            res.statusCode = 400
            res.setHeader("Content-Type", "application/json")
            res.end(JSON.stringify(`No Such User`))
        }
    } catch (err) {
        res.statusCode = 500
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify(err))
    }
})

export {userRouter}