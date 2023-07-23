import { create_chunks } from "./chunk.mjs";
import { inser_multi_vectors } from "./pinecone.mjs";
import PDFParser from "pdf2json";
import { resolve, join } from 'path'

const __dirname = resolve()

// https://www.npmjs.com/package/pdf2json
export const pdf_to_text = (file_name) => {
    const pdfParser = new PDFParser(this, 1);

    return new Promise((resolve, reject) => {
        pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", pdfData => {
            // console.log(pdfData);
            resolve(pdfParser.getRawTextContent())
        });
        pdfParser.loadPDF(join(__dirname, `data/${file_name}`));
    })
}

// console.log(await pdf_to_text('obaidmuneer.pdf'));

export const ingest_pdf = async (name_of_file, chuck_size, chunk_overlap) => {
    const text = await pdf_to_text(name_of_file)
    const cleanedText = String(text.replace(/[\r\n]+/g, ""));
    // console.log(cleanedText);
    const chunks = create_chunks(cleanedText, chuck_size, chunk_overlap) // modify the chunks and overlap size according to your need
    await inser_multi_vectors(chunks)
    // console.log(chunks);
}
// await ingest_pdf()
