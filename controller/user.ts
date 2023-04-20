import UserModel, {User} from "../model/user";
import upload from "../services/image";
import {GenerateToken, AuthToken, RefreshToken} from "../middleware/auth";
import SavePDF from "../services/pdf"

import fs from "fs";

import express from "express";
import bodyParser from "body-parser"


const userPdf = "assets/pdf/downloaded.pdf"

const app: express.Application = express();
app.use(bodyParser.json())

// Login User
app.post('/api/login', (req, res) => {
    const {email} = req.body
    UserModel.RetrieveById(email)
        .then(user => {
            if (user) {
                console.log(user)
                const accessToken = GenerateToken(user)
                res.statusCode = 200
                res.json({accessToken})
            } else {
                res.statusCode = 404
                res.setHeader("Content-Type", "plain/text")
                res.end("No such User")
            }

        })
        .catch(e => {
            console.log(e)
            res.statusCode = 500
            res.setHeader("Content-Type", "plain/text")
            res.end(`Error: ${e}`)
        })
})

// Refresh User Token
app.post('/api/token', AuthToken, (req, res) => {
    const {email, token} = req.body
    console.log(email, token)
    UserModel.RetrieveById(email)
        .then(user => {
            if (user) {
                console.log(user)
                const accessToken = RefreshToken(token, user)
                res.statusCode = 200
                res.json({accessToken})
            } else {
                res.statusCode = 404
                res.setHeader("Content-Type", "plain/text")
                res.end("No such User")
            }

        })
        .catch(e => {
            console.log(e)
            res.statusCode = 500
            res.setHeader("Content-Type", "plain/text")
            res.end(`Error: ${e}`)
        })
})

// Get All Users
app.get("/api/users", AuthToken, (req, res) => {
    UserModel.RetrieveAll()
        .then(users => {
            console.log(users)
            res.statusCode = 200
            res.setHeader("Content-Type", "application/json")
            res.end(JSON.stringify(users))
        })
        .catch(e => {
            console.log(e)
            res.statusCode = 500
            res.setHeader("Content-Type", "plain/text")
            res.end(`Error: ${e}`)
        })
})

// Get User By Email
app.get("/api/user/:email", AuthToken, (req, res) => {
    const email: string = req.params.email;
    UserModel.RetrieveById(email)
        .then(user => {
            console.log(user)
            if (user) {
                res.statusCode = 200
                res.setHeader("Content-Type", "application/json")
                res.end(JSON.stringify(user))
            } else {
                res.statusCode = 404
                res.setHeader("Content-Type", "plain/text")
                res.end("No such User")
            }

        })
        .catch(e => {
            console.log(e)
            res.statusCode = 500
            res.setHeader("Content-Type", "plain/text")
            res.end(`Error: ${e}`)
        })
})

// Insert User
app.post("/api/user", (req, res) => {
    const user: User = JSON.parse(JSON.stringify(req.body));

    UserModel.Insert(user)
        .then((user) => {
            res.statusCode = 200
            res.setHeader("Content-Type", "application/json")
            res.end(JSON.stringify(user))
        })
        .catch((e) => {
            if (e.name === "SequelizeUniqueConstraintError") {
                res.statusCode = 500
                res.setHeader("Content-Type", "plain/text")
                res.end("This User already exists")
            } else {
                res.statusCode = 500
                res.setHeader("Content-Type", "application/json")
                res.end(JSON.stringify(e))
            }

        })
})

// Update User
app.put("/api/user", AuthToken, (req, res) => {
    const user: User = JSON.parse(JSON.stringify(req.body));

    UserModel.Update(user)
        .then((count) => {
            if (count[0]) {
                res.statusCode = 200
                res.setHeader("Content-Type", "application/json")
                res.end(JSON.stringify(user))
            } else {
                res.statusCode = 404
                res.setHeader("Content-Type", "plain/text")
                res.end("No such User")
            }
        })
        .catch(e => {
            console.log(e)
            res.statusCode = 500
            res.setHeader("Content-Type", "plaint/text")
            res.end(e)
        })
})

// Delete User
app.delete("/api/user/:email", AuthToken, (req, res) => {
    const email: string = req.params.email;

    UserModel.Delete(email)
        .then((deleted) => {
            if (deleted) {
                console.log(`User with email ${email} has been deleted`);
                res.statusCode = 200
                res.setHeader("Content-Type", "plaint/text")
                res.end(`User with email ${email} has been deleted`)
            } else {
                console.log(`No user found with email ${email}`);
                res.statusCode = 404
                res.setHeader("Content-Type", "plaint/text")
                res.end(`No user found with email ${email}`)
            }
        })
        .catch((e) => {
            console.error(`Error deleting user: ${e}`);
            res.statusCode = 500
            res.setHeader("Content-Type", "plaint/text")
            res.end(`Error deleting user: ${e}`)
        })
})

// Save Image
app.post("/api/image", AuthToken, upload.single("image"), (req, res) => {
    try {
        const filename = req.file?.filename
        res.statusCode = 200
        res.setHeader("Content-Type", "plaint/text")
        res.end(`Image: ${filename} uploaded`)
    } catch (e) {
        res.statusCode = 500
        res.setHeader("Content-Type", "plaint/text")
        res.end(`Error while uploading error: ${e}`)
    }
})

// Create Pdf
app.post("/api/pdf", AuthToken, (req, res) => {
    const userEmail: User = JSON.parse(JSON.stringify(req.body));
    const user: User = new User()

    UserModel.RetrieveById(userEmail.email)
        .then((localeUser) => {
            console.log(localeUser)
            if (!localeUser) {
                res.statusCode = 404
                res.setHeader("Content-Type", "plaint/text")
                res.end(`No such user`)
            } else {
                user.email = localeUser?.email
                user.firstName = localeUser?.firstName
                user.lastName = localeUser?.lastName
                user.image = localeUser?.image

                SavePDF(user.firstName, user.lastName, user.image)

            }
        })
        .then(() => {
            UserModel.SavePDF(user.email)
                .then((count) => {
                    console.log(count)
                    if (count) {
                        res.statusCode = 200
                        res.setHeader("Content-Type", "application/json")
                        res.end(JSON.stringify(true))
                    } else {
                        res.statusCode = 500
                        res.setHeader("Content-Type", "plain/text")
                        res.end("Internal error try later")
                    }
                })
                .catch(e => {
                    console.log(e)
                    res.statusCode = 500
                    res.setHeader("Content-Type", "application/json")
                    res.end(JSON.stringify(e))
                })
        })
        .catch((e) => {
            res.statusCode = 500
            res.setHeader("Content-Type", "plaint/text")
            res.end(`Error: ${e}`)
        })
})

// Download Pdf
app.get("/api/pdf/:email", AuthToken, (req, res) => {
    const email: string = req.params.email;
    UserModel.RetrieveById(email)
        .then(user => {
            const data = user?.pdf
            fs.writeFile(userPdf, data, (err) => {
                if (err) throw err;
                console.log('PDF saved to file');
                res.statusCode = 200
                res.setHeader("Content-Type", "plaint/text")
                res.end('PDF saved to file')
            });
        })
        .catch((err) => {
            console.log(`Error retrieving PDF from database: ${err} `);
            res.statusCode = 500
            res.setHeader("Content-Type", "plaint/text")
            res.end(`Error retrieving PDF from database: ${err} `)
        });
})

export default app