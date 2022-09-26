import React, { useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import axios from "axios";

const Merge = () => {
  const [pdfs, setPdfs] = useState();
  const [downloadLink, setDownloadLink] = useState(null);

  const getPdf = async () => {
    let one =
      "https://eu.backendlessappcontent.com/8B68D16E-6CCF-4DE3-FFE7-ED69748FF000/72912970-34C6-49DC-9862-C077EAC5A84F/files/feedback_action_pdfs/actions/European+commissioner.pdf";
    let two =
      "https://eu.backendlessappcontent.com/8B68D16E-6CCF-4DE3-FFE7-ED69748FF000/72912970-34C6-49DC-9862-C077EAC5A84F/files/feedback_action_pdfs/actions/new+cat2.pdf";

    const requestOne = axios({
      method: "GET",
      url: one,
      responseType: "arraybuffer",
    });
    const requestTwo = axios({
      method: "GET",
      url: two,
      responseType: "arraybuffer",
    });

    await axios.all([requestOne, requestTwo]).then(
      axios.spread(async (...responses) => {
        const check1 = [];
        await responses.forEach(async (response) => {
          console.log("response", response.data);
          //check1.push(response.data);
          const pdfDoc = await PDFDocument.load(response.data);

          check1.push(pdfDoc);
        });
        console.log("check1", check1);
        setTimeout(async () => {
          const pdfDocuments = await Promise.all(check1);
          const mergedPdf = await PDFDocument.create();
          console.log("pdfDocuments", pdfDocuments);
          for (const pdf of pdfDocuments) {
            const copiedPages = await mergedPdf.copyPages(
              pdf,
              pdf.getPageIndices()
            );
            console.log("copiedPages", copiedPages);
            copiedPages.forEach((page) => {
              mergedPdf.addPage(page);
            });
          }
          //const check2 = responses[1];
          console.log("mergedPdf", mergedPdf);

          const mergedPdfFile = await mergedPdf.save({ addDefaultPage: false });
          console.log("mergedPdfFile", mergedPdfFile);
          const mergedPdfBlob = new Blob([mergedPdfFile], {
            type: "application/pdf",
          });
          console.log("mergedPdfBlob", mergedPdfBlob);
          const mergedPdfUrl = URL.createObjectURL(mergedPdfBlob);
          console.log("mergedPdfUrl", mergedPdfUrl);

          setDownloadLink(mergedPdfUrl);
          //console.log("check2", check2);
          // use/access the results
        }, 1000);
      })
    );
  };
  useEffect(() => {
    getPdf();
  }, []);
  console.log("pdf", pdfs);
  return (
    <>
      <div>
        <a
          className="w-100 my-2 big-text"
          variant="warning"
          href={downloadLink}
          download="merged.pdf"
        >
          Download
        </a>
      </div>
    </>
  );
};

export default Merge;
