import React, { useState, useEffect } from "react";

import API from "../redux/API";
import {success,fail} from "../redux/WebTostar";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import pdfWorker from "../js/pdf.worker.min.js";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
let openFn = null;
const fileViewer = {
  openFile: (url,type) => {
    // if(type===1){
      if (openFn) openFn(url);
      else console.warn("FileViewer not mounted yet");
    // }
  },
};

export default fileViewer;

export function FileViewerComponent() {
  const [show, setShow] = useState(false);
  const [url, setUrl] = useState("");
  const [pages, setPages] = useState([]);

  const isImage = (u) =>
    /\.(jpg|jpeg|png|gif|webp)$/i.test(u);

  const isPDF = (u) => /\.pdf$/i.test(u);

  const openFile = (fileUrl) => {
    setUrl(fileUrl);
    setShow(true);
  };

  useEffect(() => {
    openFn = openFile;
  }, []);

  // PDF render
  useEffect(() => {
    const loadPdf = async () => {
      if (!show || !isPDF(url)) return;

      const pdf = await pdfjsLib.getDocument(url).promise;

      const arr = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.4 });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: ctx,
          viewport,
        }).promise;

        arr.push(canvas.toDataURL());
      }

      setPages(arr);
    };

    loadPdf();
  }, [show, url]);

  const close = () => {
    setShow(false);
    setUrl("");
    setPages([]);
  };

  const downloadFile = () => {
    const fileName = new URL(url).searchParams.get("fileName");
     try {
       let payload={
        fileName:fileName,
        path:"expense",
        type:2,
      };
      API.openFileInBrowser(payload);
      success("Bill Downloaded");
    } catch (error) {
      console.error("Error:", error);
    }
    // alert("call");
  };

  return (
    <>
      {show && (
        <div style={styles.overlay}>
          <div style={styles.modal}>

            {/* HEADER */}
            <div style={styles.header}>
              <div style={styles.title}>📁 File Preview</div>

              <div style={styles.actions}>
                <button onClick={downloadFile} style={styles.btn}>
                  ⬇ Download
                </button>
                <button onClick={close} style={styles.closeBtn}>
                  ✖
                </button>
              </div>
            </div>

            {/* BODY */}
            <div style={styles.body}>

              {/* IMAGE */}
              {isImage(url) && (
                <img
                  src={url}
                  alt="preview"
                  style={styles.image}
                />
              )}

              {/* PDF */}
              {isPDF(url) && (
                <div style={styles.pdfContainer}>
                  {pages.map((p, i) => (
                    <img key={i} src={p} style={styles.page} />
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* 🔥 MODERN STYLES */
const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(6px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9990,
  },

  modal: {
    width: "50%",
    height: "90%",
    background: "#fff",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
  },

  header: {
    height: "55px",
    background: "#111827",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 15px",
  },

  title: {
    fontSize: "16px",
    fontWeight: "600",
  },

  actions: {
    display: "flex",
    gap: "10px",
  },

  btn: {
    background: "#22c55e",
    border: "none",
    padding: "6px 12px",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer",
  },

  closeBtn: {
    background: "#ef4444",
    border: "none",
    padding: "6px 12px",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer",
  },

  body: {
    flex: 1,
    overflow: "auto",
    background: "#f3f4f6",
    padding: "10px",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },

  pdfContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  page: {
    width: "100%",
    borderRadius: "6px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
};