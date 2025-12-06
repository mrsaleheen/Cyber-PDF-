import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';

// Helper to read file as ArrayBuffer
const readFile = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const createPdfFromImages = async (files: File[]): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();
  
  for (const file of files) {
    const buffer = await readFile(file);
    let image;
    if (file.type === 'image/jpeg') {
      image = await pdfDoc.embedJpg(buffer);
    } else {
      image = await pdfDoc.embedPng(buffer);
    }
    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }
  
  return await pdfDoc.save();
};

export const mergePdfs = async (files: File[]): Promise<Uint8Array> => {
  const mergedPdf = await PDFDocument.create();
  
  for (const file of files) {
    const buffer = await readFile(file);
    const pdf = await PDFDocument.load(buffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  
  return await mergedPdf.save();
};

export const splitPdf = async (file: File, rangeStart: number, rangeEnd: number): Promise<Uint8Array> => {
  const buffer = await readFile(file);
  const pdfDoc = await PDFDocument.load(buffer);
  const newPdf = await PDFDocument.create();
  
  // Validate range
  const pageCount = pdfDoc.getPageCount();
  const start = Math.max(0, rangeStart - 1);
  const end = Math.min(pageCount - 1, rangeEnd - 1);
  
  if (start > end) throw new Error("Invalid page range");

  const indices: number[] = [];
  for(let i=start; i<=end; i++) indices.push(i);

  const copiedPages = await newPdf.copyPages(pdfDoc, indices);
  copiedPages.forEach((page) => newPdf.addPage(page));
  
  return await newPdf.save();
};

export const addWatermark = async (file: File, text: string): Promise<Uint8Array> => {
  const buffer = await readFile(file);
  const pdfDoc = await PDFDocument.load(buffer);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pages = pdfDoc.getPages();

  pages.forEach(page => {
    const { width, height } = page.getSize();
    const fontSize = 50;
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const textHeight = font.heightAtSize(fontSize);
    
    page.drawText(text, {
      x: width / 2 - textWidth / 2,
      y: height / 2 - textHeight / 2,
      size: fontSize,
      font: font,
      color: rgb(0.13, 0.77, 0.37), // Greenish
      opacity: 0.3,
      rotate: degrees(45),
    });
  });

  return await pdfDoc.save();
};

export const lockPdf = async (file: File, password: string): Promise<Uint8Array> => {
  const buffer = await readFile(file);
  const pdfDoc = await PDFDocument.load(buffer);
  
  // Encrypt
  pdfDoc.encrypt({
    userPassword: password,
    ownerPassword: password,
    permissions: {
      printing: 'highResolution',
      modifying: false,
      copying: false,
      annotating: false,
      fillingForms: false,
      contentAccessibility: false,
      documentAssembly: false,
    },
  });

  return await pdfDoc.save();
};

// Simulation helpers for things we can't do purely client side without heavy WASM
export const simulateProcessing = async (duration = 2000) => {
  return new Promise(resolve => setTimeout(resolve, duration));
};