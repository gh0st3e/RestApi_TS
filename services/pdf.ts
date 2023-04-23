import {logger} from "../main";
import UserModel from "../model/user";

import fs from "fs"

import PDFDocument from "pdfkit"

const userPdf = "assets/pdf/userPDF.pdf"
const downloadedPdf = "assets/pdf/downloaded.pdf"

// Save pdf on server.
export const SavePDF = async (firstName: string, lastName: string, image: string) => {
    try{
        logger.info("Save PDF Started")
        const pdfDoc = new PDFDocument
        pdfDoc.pipe(fs.createWriteStream(userPdf))
        pdfDoc.text(`${firstName} ${lastName}`)
        pdfDoc.image(`assets/images/${image}`, {fit: [250, 250], align: 'center', valign: 'center'})
        pdfDoc.end()
        logger.info("Save PDF Ended")

        return null
    }catch (err){
        logger.error(`Error while saving PDF ${err}`)
        return err
    }
}

// Update user pdf-field.
export const UpdatePDF = async (email: string) => {
    logger.info("Update PDF Started")
    const data = await fs.promises.readFile(userPdf);
    const updatedPDF = await UserModel.UpdateUserPDF(email, data)
    logger.info(`Update PDF Ended: Result: ${updatedPDF}`)
    return updatedPDF
}

// Download pdf in
export const DownloadPDF = async (data: Buffer): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
        logger.info("Downloaded PDF Started")
        fs.writeFile(downloadedPdf, data, (err) => {
            logger.log("Downloaded PDF Ended")
            resolve(!err)
        })
    })
}

export const PDFService = {
    SavePDF,
    UpdatePDF,
    DownloadPDF
}