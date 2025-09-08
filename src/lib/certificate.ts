import fs from "fs";
import path from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import * as fontkit from "fontkit";

// Normalize names for cursive/running fonts: if input is ALL CAPS, convert to Title Case.
export function normalizeNameForCursive(input: string): string {
  if (!input) return input;
  const isAllCaps = input === input.toUpperCase();
  if (!isAllCaps) return input;
  const lower = input.toLowerCase();
  let result = "";
  let capitalizeNext = true;
  for (const ch of lower) {
    const isLetter = /[A-Za-z]/.test(ch);
    if (isLetter && capitalizeNext) {
      result += ch.toUpperCase();
      capitalizeNext = false;
    } else {
      result += ch;
      capitalizeNext = /[\s\-']/.test(ch);
    }
  }
  return result;
}

export async function generateCertificatePDF(name: string, dateStr: string) {
  const certImagePath = path.join(process.cwd(), "public/certificate.jpg");
  const certImageBytes = fs.readFileSync(certImagePath);

  const fontPath = path.join(process.cwd(), "public/fonts/FormaleScript_PERSONAL_USE_ONLY.otf");
  const customFontBytes = fs.readFileSync(fontPath);

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit as any);

  const page = pdfDoc.addPage([842, 595]);

  const jpgImage = await pdfDoc.embedJpg(certImageBytes);
  page.drawImage(jpgImage, {
    x: 0,
    y: 0,
    width: 842,
    height: 595,
  });

  const cursiveFont = await pdfDoc.embedFont(customFontBytes);

  const safeName = normalizeNameForCursive(name);
  const textWidth = cursiveFont.widthOfTextAtSize(safeName, 28);
  const pageWidth = 842;
  const centerX = (pageWidth - textWidth) / 2;
  
  page.drawText(safeName, {
    x: centerX,
    y: 200,
    size: 28,
    font: cursiveFont,
    color: rgb(0, 0, 0),
  });

  const standardFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  page.drawText(dateStr, {
    x: 255,
    y: 70,
    size: 18,
    font: standardFont,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}


