// PDFEditorContext.tsx
import React, { createContext, useContext, useState } from "react";
import { CourseData } from "../components/Types/Types";

type PDFEditorContextType = {
  pdfFile: File | null;
  setPdfFile: (file: File | null) => void;
  formData: CourseData | null;
  setFormData: (data: CourseData) => void;
};

const PDFEditorContext = createContext<PDFEditorContextType | undefined>(undefined);

export const PDFEditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<CourseData | null>(null);

  return (
    <PDFEditorContext.Provider value={{ pdfFile, setPdfFile, formData, setFormData }}>
      {children}
    </PDFEditorContext.Provider>
  );
};

export const usePDFEditorContext = () => {
  const context = useContext(PDFEditorContext);
  if (!context) {
    throw new Error("usePDFEditorContext must be used within PDFEditorProvider");
  }
  return context;
};
