import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CourseData } from "../Types/Types";
import { usePDFEditorContext } from "../../contexts/PDFEditorContext";
import "../../assets/FormStyle.scss";

const initialForm: CourseData = {
  id: "",
  candidateName: "",
  courseName: "",
  courseId: "",
  startDate: "",
  endDate: "",
  description: "",
};

type ErrorState = Partial<Record<keyof CourseData | "date" | "pdf", string>>;

const CertificateDetailsForm: React.FC = () => {
  const [formData, setFormData] = useState<CourseData>(initialForm);
  const [errors, setErrors] = useState<ErrorState>({});
  const [localPdfFile, setLocalPdfFile] = useState<File | null>(null);

  const { setPdfFile, setFormData: saveFormToContext } = usePDFEditorContext();
  const navigate = useNavigate();

  const uniqueIdRef = useRef(crypto.randomUUID());

  const validate = useCallback(() => {
    const newErrors: ErrorState = {};

    if (!formData.candidateName.trim()) newErrors.candidateName = "Candidate name is required";
    if (!formData.courseName.trim()) newErrors.courseName = "Course name is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!localPdfFile) newErrors.pdf = "Certificate background PDF is required";

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) > new Date(formData.endDate)
    ) {
      newErrors.date = "Start date cannot be after end date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, localPdfFile]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    },
    []
  );

  const handlePDFUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLocalPdfFile(file);
      setErrors((prev) => ({ ...prev, pdf: "" }));
    }
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      setPdfFile(localPdfFile!);

      const finalData: CourseData = {
        ...formData,
        id: uniqueIdRef.current,
        courseId: uniqueIdRef.current,
      };

      saveFormToContext(finalData);

      setFormData(initialForm);
      setLocalPdfFile(null);

      navigate(`/certificate/generate?id=${finalData.id}`);
    },
    [formData, localPdfFile, navigate, saveFormToContext, setPdfFile, validate]
  );

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Enter Certificate Details</h2>

      <div className="form-group">
        <label>Candidate Name</label>
        <input
          type="text"
          name="candidateName"
          value={formData.candidateName}
          onChange={handleChange}
        />
        {errors.candidateName && <span className="error">{errors.candidateName}</span>}
      </div>

      <div className="form-group">
        <label>Course Name</label>
        <input
          type="text"
          name="courseName"
          value={formData.courseName}
          onChange={handleChange}
        />
        {errors.courseName && <span className="error">{errors.courseName}</span>}
      </div>

      <div className="form-group">
        <label>Course ID</label>
        <input
          type="text"
          name="courseId"
          value={uniqueIdRef.current}
          readOnly
        />
      </div>

      <div className="form-group">
        <label>Start Date</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
        />
        {errors.startDate && <span className="error">{errors.startDate}</span>}
      </div>

      <div className="form-group">
        <label>End Date</label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
        />
        {errors.endDate && <span className="error">{errors.endDate}</span>}
        {errors.date && <span className="error">{errors.date}</span>}
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        {errors.description && <span className="error">{errors.description}</span>}
      </div>

      <div className="form-group">
        <label>Upload Certificate Background PDF</label>
        <input type="file" accept="application/pdf" onChange={handlePDFUpload} />
        {errors.pdf && <span className="error">{errors.pdf}</span>}
      </div>

      <button type="submit">Create Certificate</button>
    </form>
  );
};

export default CertificateDetailsForm;
