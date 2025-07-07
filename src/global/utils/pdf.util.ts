import PDFDocument from 'pdfkit';
import path from 'path';
import { IWord } from "../../domain/word/word.model";

export function generatePdf(words: IWord[]) {
    const doc = new PDFDocument({ margin: 30 });
    const fontPath = path.join(__dirname, '../../assets/fonts/PretendardJP-Regular.otf');
    doc.registerFont('PretendardJP', fontPath);
    doc.font('PretendardJP');

    const buffers: Buffer[] = [];

    doc.on('data', (chunk) => buffers.push(chunk));
    return new Promise<Buffer>((resolve) => {
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
        const halfWidth = pageWidth / 2;

        const col1WordX = doc.page.margins.left;
        const col1PronX = col1WordX + 130;

        const col2WordX = doc.page.margins.left + halfWidth;
        const col2PronX = col2WordX + 130;

        let y = doc.page.margins.top;

        for (let i = 0; i < words.length; i += 2) {
            const word1 = words[i];
            const word2 = words[i + 1];

            if (word1) {
                doc.fontSize(10).text(word1.word, col1WordX, y);
                const text1 = `${word1.reading} ${word1.meaning}`;
                doc.fontSize(text1.length >= 15 ? 9 : 10).text(text1, col1PronX, y);
            }

            if (word2) {
                doc.fontSize(10).text(word2.word, col2WordX, y);
                const text2 = `${word2.reading} ${word2.meaning}`;
                doc.fontSize(text2.length >= 15 ? 9 : 10).text(text2, col2PronX, y);
            }

            y += 20;

            if (y > doc.page.height - doc.page.margins.bottom - 20) {
                doc.addPage();
                y = doc.page.margins.top;
            }
        }

        doc.end();
    });
}