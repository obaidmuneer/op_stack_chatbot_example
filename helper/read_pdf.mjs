import PDFParser from "pdf2json";

// https://www.npmjs.com/package/pdf2json
export const pdf_to_text = (pathToFile) => {
    const pdfParser = new PDFParser(this, 1);

    return new Promise((resolve, reject) => {
        pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", pdfData => {
            // console.log(pdfData);
            resolve(pdfParser.getRawTextContent())
        });
        pdfParser.loadPDF(pathToFile);
    })
}

// console.log(await pdf_to_text('./data/obaidmuneer.pdf'));
