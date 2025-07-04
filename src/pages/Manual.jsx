import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";
import PageLayout from "../layouts/PageLayout";

// Set the workerSrc for pdfjs-dist to a public path for Vite compatibility
GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

const PDF_PATH = "/assets/ktm%20manual.pdf";

const Manual = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfDoc, setPdfDoc] = useState(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // Load the PDF document only once
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getDocument(PDF_PATH).promise.then((doc) => {
      if (isMounted) {
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Render the current page only when pageNumber or pdfDoc changes
  useEffect(() => {
    if (!pdfDoc) return;
    setLoading(true);
    pdfDoc.getPage(pageNumber).then((page) => {
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      // Safari: force canvas size as integer to avoid blurry rendering
      canvas.height = Math.round(viewport.height);
      canvas.width = Math.round(viewport.width);
      page.render({ canvasContext: context, viewport }).promise.then(() => {
        setLoading(false);
      });
    });
  }, [pageNumber, pdfDoc]);

  const handlePrev = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handleNext = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  // Prevent right-click, drag, and context menu
  useEffect(() => {
    const prevent = (e) => e.preventDefault();
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("contextmenu", prevent);
      canvas.addEventListener("dragstart", prevent);
      canvas.addEventListener("mousedown", prevent);
    }
    return () => {
      if (canvas) {
        canvas.removeEventListener("contextmenu", prevent);
        canvas.removeEventListener("dragstart", prevent);
        canvas.removeEventListener("mousedown", prevent);
      }
    };
  }, [canvasRef, pageNumber]);

  // Input for jumping to a specific page
  const [inputValue, setInputValue] = useState("");
  const handleInputChange = (e) => {
    setInputValue(e.target.value.replace(/[^0-9]/g, ""));
  };
  const handleInputGo = (e) => {
    e.preventDefault();
    const page = parseInt(inputValue, 10);
    if (page >= 1 && page <= numPages) {
      setPageNumber(page);
    }
    setInputValue("");
  };

  // Safari/legacy browser compatibility helpers
  const isSafari = typeof window !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  return (
    <PageLayout>
      <div className="flex flex-col w-full min-h-[min(100dvh,600px)] h-auto bg-[var(--color-bg)] relative p-4 md:p-8">
        <Helmet>
          <title>KTM RC 390 Manual | MidnightTorque</title>
          <meta name="description" content="Read the official KTM RC 390 manual online. Browse, search, and view every page of the superbike's manual." />
          <meta name="keywords" content="KTM RC 390, manual, PDF, motorcycle, superbike, MidnightTorque" />
          <meta property="og:title" content="KTM RC 390 Manual | MidnightTorque" />
          <meta property="og:description" content="Read the official KTM RC 390 manual online. Browse, search, and view every page of the superbike's manual." />
        </Helmet>
        <h1 className="text-3xl md:text-4xl font-bold text-center text-[var(--color-accent)] mb-6 mt-2 tracking-widest uppercase font-heading">Manual</h1>
        <div className="flex flex-row flex-wrap mweb-flex-col w-full h-auto">
          <div className="max-w-3xl mx-auto p-6 bg-[rgba(26,26,26,0.95)] rounded shadow-lg mt-8 text-[var(--color-white)] select-none w-full">
            <div className="flex flex-col items-center">
              <canvas ref={canvasRef} style={{ maxWidth: "100%", borderRadius: 8, boxShadow: "0 2px 8px #0008" }} />
              {loading && <div className="mt-4 text-[var(--color-accent)]">Loading...</div>}
              <div className="flex gap-4 mt-4">
                <button onClick={handlePrev} disabled={pageNumber === 1} className="button button-primary" style={{ minWidth: 64 }}>Prev</button>
                <span>Page {pageNumber} of {numPages}</span>
                <button onClick={handleNext} disabled={pageNumber === numPages} className="button button-primary" style={{ minWidth: 64 }}>Next</button>
                <form onSubmit={handleInputGo} className="flex items-center gap-1">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Go to page"
                    className="w-16 px-2 py-1 rounded border border-[var(--color-accent)] bg-transparent text-[var(--color-white)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                  <button type="submit" className="button button-secondary" style={{ minWidth: 48 }}>Go</button>
                </form>
              </div>
            </div>
            <div className="text-xs text-[var(--color-accent)] mt-8">
              This manual is strictly for reference. Downloading, copying, or redistributing is strictly prohibited.<br/>
              All anti-download and anti-inspect measures are enabled.
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Manual;
