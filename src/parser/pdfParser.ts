import * as pdfjsLib from 'pdfjs-dist';

/**
 * Configure PDF.js worker.
 *
 * Priority order:
 *  1. chrome.runtime.getURL  — works inside a packaged extension (no CSP issues)
 *  2. /pdf.worker.min.js     — works during Vite dev server
 *  3. Fallback blob worker   — last resort so we never crash on worker setup
 */
function configurePdfWorker() {
  if (typeof window === 'undefined' || !pdfjsLib.GlobalWorkerOptions) return;

  try {
    if (typeof chrome !== 'undefined' && chrome.runtime?.getURL) {
      // Packaged extension: worker is copied to dist root by Vite plugin
      pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('pdf.worker.min.js');
    } else {
      // Dev server: Vite serves static files from the project root
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
    }
  } catch {
    // Ignore worker setup errors — pdfjs-dist will fall back to a fake worker
  }
}

configurePdfWorker();

export async function parsePdfFile(file: File): Promise<string> {
  // Ensure worker is configured on every call (popup context may re-create the module)
  configurePdfWorker();

  let arrayBuffer: ArrayBuffer;
  try {
    arrayBuffer = await file.arrayBuffer();
  } catch {
    throw new Error(`Cannot read file "${file.name}". Please try again.`);
  }

  let pdf: pdfjsLib.PDFDocumentProxy;
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      // Suppress most password/encryption errors
      password: '',
    });
    pdf = await loadingTask.promise;
  } catch (err: any) {
    const msg = (err?.message || '').toLowerCase();
    if (msg.includes('password')) {
      throw new Error('This PDF is password-protected. Please remove the password and re-upload.');
    }
    if (msg.includes('invalid') || msg.includes('corrupt')) {
      throw new Error(`The file "${file.name}" appears to be corrupted or is not a valid PDF.`);
    }
    throw new Error(`Could not open PDF "${file.name}". Try re-saving or exporting it from your editor.`);
  }

  let fullText = '';
  let pagesWithText = 0;

  for (let i = 1; i <= pdf.numPages; i++) {
    try {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      // Reconstruct text with proper spacing between items
      let pageText = '';
      let lastY: number | null = null;
      for (const item of textContent.items as any[]) {
        if (!item.str) continue;
        // If Y position jumped (new line), add newline
        const y = item.transform?.[5] ?? null;
        if (lastY !== null && y !== null && Math.abs(y - lastY) > 2) {
          pageText += '\n';
        }
        pageText += item.str + ' ';
        lastY = y;
      }

      const cleaned = pageText.replace(/  +/g, ' ').trim();
      if (cleaned.length > 0) {
        pagesWithText++;
        fullText += cleaned + '\n';
      }
    } catch {
      // Skip pages that fail individually — don't crash entire parse
    }
  }

  // If no text was extracted at all, the PDF is likely a scanned image
  if (!fullText.trim()) {
    if (pagesWithText === 0) {
      throw new Error(
        `"${file.name}" appears to be a scanned image PDF with no embedded text.\n\n` +
        `To fix this:\n` +
        `• Export your resume as PDF from Google Docs, Microsoft Word, or Notion\n` +
        `• Or copy-paste the text into a .txt file and upload that instead`
      );
    }
    throw new Error(`No text could be extracted from "${file.name}". Please try a different file.`);
  }

  return fullText;
}
