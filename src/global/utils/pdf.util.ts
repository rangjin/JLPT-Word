import PDFDocument from 'pdfkit';
import path from 'path';
import { IWord } from "../../domain/word/word.model";

export function generatePdfStream(words: IWord[]) {
    const doc = new PDFDocument({ margin: 30 });
    const fontPath = path.join(__dirname, '../../assets/fonts/PretendardJP-Regular.otf');
    doc.registerFont('PretendardJP', fontPath).font('PretendardJP');

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const halfWidth = pageWidth / 2;
    const col1WordX = doc.page.margins.left;
    const col1PronX = col1WordX + 130;
    const col2WordX = doc.page.margins.left + halfWidth;
    const col2PronX = col2WordX + 130;
    let y = doc.page.margins.top;

    for (let i = 0; i < words.length; i += 2) {
        const w1 = words[i];
        const w2 = words[i + 1];

        if (w1) {
            doc.fontSize(10).text(w1.word, col1WordX, y);
            const t1 = `${w1.reading} ${w1.meaning}`;
            doc.fontSize(t1.length >= 15 ? 9 : 10).text(t1, col1PronX, y);
        }
        if (w2) {
            doc.fontSize(10).text(w2.word, col2WordX, y);
            const t2 = `${w2.reading} ${w2.meaning}`;
            doc.fontSize(t2.length >= 15 ? 9 : 10).text(t2, col2PronX, y);
        }

        y += 20;
        if (y > doc.page.height - doc.page.margins.bottom - 20) {
            doc.addPage();
            y = doc.page.margins.top;
        }
    }

    doc.end();

    return doc;
}