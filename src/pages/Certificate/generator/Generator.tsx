import React, { useRef, useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;
import { usePDFEditorContext } from "../../../contexts/PDFEditorContext";
import "./Generator.scss";


const Generator: React.FC = () => {
  const { pdfFile, formData } = usePDFEditorContext();
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [elements, setElements] = useState<{ [key: string]: { x: number; y: number } }>({});
  const [focusedElement, setFocusedElement] = useState<string | null>(null);
  const certificateRef = useRef<HTMLDivElement>(null);
  const touchRefs = useRef<{ [key: string]: { offsetX: number; offsetY: number } | null }>({});

  
  const handleDrag = (key: string, e: React.DragEvent<HTMLDivElement>) => {
    const parent = certificateRef.current?.getBoundingClientRect();
    const elem = e.currentTarget.getBoundingClientRect();
  
    if (parent) {
      let x = e.clientX - parent.left;
      let y = e.clientY - parent.top;
  
      // Clamp the x and y to stay within the parent boundaries
      x = Math.max(0, Math.min(x, parent.width - elem.width));
      y = Math.max(0, Math.min(y, parent.height - elem.height));
  
      setElements((prev) => ({ ...prev, [key]: { x, y } }));
    }
  };

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    const canvas = await html2canvas(certificateRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "px", [canvas.width, canvas.height]);
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${formData?.candidateName || "certificate"}.pdf`);
  };

  const renderDraggable = (
    label: string,
    content: string | React.ReactNode,
    className?: string
  ) => {
    const style = {
      left: elements[label]?.x || 50,
      top: elements[label]?.y || 50,
      position: "absolute" as const,
      touchAction: "none",
      outline: focusedElement === label ? "2px dashed #333" : "none",
    };
  
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (focusedElement !== label) return;
  
      const step = 5;
      setElements((prev) => {
        const current = prev[label] || { x: 50, y: 50 };
        let { x, y } = current;
  
        switch (e.key) {
          case "ArrowUp": y = Math.max(0, y - step); break;
          case "ArrowDown": y = y + step; break;
          case "ArrowLeft": x = Math.max(0, x - step); break;
          case "ArrowRight": x = x + step; break;
          default: return prev;
        }
  
        return { ...prev, [label]: { x, y } };
      });
    };
  
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
      const touch = e.touches[0];
      const parentRect = certificateRef.current?.getBoundingClientRect();
      const elemRect = e.currentTarget.getBoundingClientRect();
  
      if (parentRect && elemRect) {
        touchRefs.current[label] = {
          offsetX: touch.clientX - elemRect.left,
          offsetY: touch.clientY - elemRect.top,
        };
      }
    };
  
    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
      e.preventDefault();
      const touch = e.touches[0];
      const parentRect = certificateRef.current?.getBoundingClientRect();
      const touchData = touchRefs.current[label];
  
      if (parentRect && touchData) {
        const { offsetX, offsetY } = touchData;
        let x = touch.clientX - parentRect.left - offsetX;
        let y = touch.clientY - parentRect.top - offsetY;
  
        x = Math.max(0, Math.min(x, parentRect.width - 50));
        y = Math.max(0, Math.min(y, parentRect.height - 50));
  
        setElements((prev) => ({
          ...prev,
          [label]: { x, y },
        }));
      }
    };
  
    return (
      <div
        className={`draggable ${className || ""}`}
        style={style}
        tabIndex={0}
        draggable
        onKeyDown={handleKeyDown}
        onFocus={() => setFocusedElement(label)}
        onBlur={() => setFocusedElement(null)}
        onDragEnd={(e) => handleDrag(label, e)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {content}
      </div>
    );
  };
  
  

  useEffect(() => {
    const loadPdf = async () => {
      if (pdfFile) {
        const reader = new FileReader();
        reader.onload = async () => {
          const typedarray = new Uint8Array(reader.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument(typedarray).promise;
          const page = await pdf.getPage(1);

          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d")!;
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: context, viewport }).promise;
          const imgData = canvas.toDataURL();
          setBgImage(imgData);
        };
        reader.readAsArrayBuffer(pdfFile);
      }
    };

    loadPdf();
  }, [pdfFile]);

  return (
    <div className="certificate-editor">
      <h2>Create Certificate</h2>
      {bgImage && formData && (
        <>
          <div className="certificate-preview" ref={certificateRef} style={{ position: "relative" }}>
            <img src={bgImage} alt="Certificate Template" className="certificate-bg" />
            {renderDraggable("Name", formData.candidateName, 'cName')}
            {renderDraggable("Course", formData.courseName, 'cCourse')}
            {renderDraggable("Tenure", `${formData.startDate} to ${formData.endDate}`, 'cTenure')}
            {renderDraggable("Description", formData.description, 'cDesc')}
            {renderDraggable("QR", (
              <QRCodeSVG
                value={JSON.stringify(formData)}
                size={64}
                level="H"
              />
            ), 'cQr')}
          </div>
          <button onClick={handleDownload}>Download Certificate</button>
        </>
      )}
    </div>
  );
};

export default Generator;
