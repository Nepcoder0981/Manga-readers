import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import type { MangaPage } from '../types/manga';

export const downloadChapter = async (
  pages: MangaPage[],
  mangaTitle: string,
  chapterNumber: string
): Promise<void> => {
  try {
    const pdf = new jsPDF('p', 'px', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      
      // Create a temporary image element
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = page.url;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Create a temporary canvas to draw the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) continue;

      // Set canvas dimensions to match image aspect ratio
      const aspectRatio = img.width / img.height;
      const canvasWidth = pdfWidth - (margin * 2);
      const canvasHeight = canvasWidth / aspectRatio;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Add the image to PDF
      if (i > 0) {
        pdf.addPage();
      }

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', margin, margin, canvasWidth, canvasHeight);
    }

    // Save the PDF
    const fileName = `${mangaTitle} - Chapter ${chapterNumber}.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};