import express from "express";
import {UserService} from "../services/user";
import {Auth} from "../middleware/auth"
import {PDFService} from "../services/pdf";
import upload from "../services/image";

const pdfRouter = express.Router()

// Save image route.
pdfRouter.post("/api/image", Auth.AuthToken, upload.single("image"), (req, res) => {
    try {
        const filename = req.file?.filename
        res.statusCode = 200
        res.setHeader("Content-Type", "plaint/text")
        res.end(`Image: ${filename} uploaded`)
    } catch (e) {
        res.statusCode = 500
        res.setHeader("Content-Type", "plaint/text")
        res.end(`Error while uploading image: ${e}`)
    }
})

// Create PDF route.
pdfRouter.post("/api/pdf", Auth.AuthToken, async (req, res) => {
    try {
        const {email} = JSON.parse(JSON.stringify(req.body));
        const user = await UserService.RetrieveByEmail(email)
        if (user) {
            const savePdfError = await PDFService.SavePDF(user.firstName, user.lastName, user.image)
            // If error while saving pdf.
            if (savePdfError){
                res.statusCode = 500
                res.setHeader("Content-Type", "application/json")
                res.end(JSON.stringify(savePdfError))

                return
            }

            const result = await PDFService.UpdatePDF(email)
            if (result) {
                res.statusCode = 200
                res.setHeader("Content-Type", "application/json")
                res.end(JSON.stringify("PDF Saved"))

                return
            } else {
                res.statusCode = 500
                res.setHeader("Content-Type", "application/json")
                res.end(JSON.stringify("Error while updating user PDF-field"))

                return
            }
        } else {
            res.statusCode = 404
            res.setHeader("Content-Type", "application/json")
            res.end(JSON.stringify(`No Such User`))

            return
        }
    } catch (err) {
        res.statusCode = 500
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify(err))
    }

})

// Download PDF route.
pdfRouter.get("/api/pdf/:email", Auth.AuthToken, async (req, res) => {
    try {
        const email: string = req.params.email;
        const user = await UserService.RetrieveByEmail(email)
        if (user) {
            const result = await PDFService.DownloadPDF(user.pdf)
            if (result) {
                res.statusCode = 200
                res.setHeader("Content-Type", "application/json")
                res.end(JSON.stringify("PDF Downloaded"))

                return
            } else {
                res.statusCode = 500
                res.setHeader("Content-Type", "application/json")
                res.end(JSON.stringify("Error while downloading PDF"))

                return
            }
        } else {
            res.statusCode = 404
            res.setHeader("Content-Type", "application/json")
            res.end(JSON.stringify(`No Such User`))

            return
        }
    } catch (err) {
        res.statusCode = 500
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify(err))
    }
})

export {pdfRouter}