import fs from "fs"

import PDFDocument from "pdfkit"


const userPdf = "assets/pdf/userPDF.pdf"

// SavePDF - func allows to save pdf in file
function SavePDF( firstName?: string, lastName?: string, image?: string) {
    const pdfDoc = new PDFDocument
    pdfDoc.pipe(fs.createWriteStream(userPdf))
    pdfDoc.text(`${firstName} ${lastName}`)
    pdfDoc.image(`assets/images/${image}`, {fit: [250, 250], align: 'center', valign: 'center'})
    pdfDoc.end()
}

export default SavePDF