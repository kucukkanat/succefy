import * as pdfjsLib from "pdfjs-dist";
import _Worker_ from "pdfjs-dist/build/pdf.worker.mjs?worker";
import { TextItem } from "pdfjs-dist/types/src/display/api";
pdfjsLib.GlobalWorkerOptions.workerPort = new _Worker_();
export type ParsedPDF = {
  filename: string;
  content: string;
};
export async function parse(files: File[]) {
  const parsedFiles: ParsedPDF[] = [];
  for (const file of files) {
    const pages: string[] = [];
    const ab = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(ab).promise;
    const numPages = pdf.numPages;
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const textItems = textContent.items
        .map((item) => {
          return (item as TextItem).hasEOL ? "\n" : (item as TextItem).str;
        })
        .join("");
      pages.push(textItems);
    }
    parsedFiles.push({
      filename: file.name,
      content: pages.join("\n\n"),
    });
  }
  return parsedFiles;
}
