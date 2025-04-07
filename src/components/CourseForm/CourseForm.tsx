import React, { useEffect, useState, useRef, useCallback } from "react";
import "../../assets/FormStyle.scss";
import { useCourseContext } from "../../contexts/CourseContext";
import { useNavigate } from "react-router-dom";
import { CourseData } from "../../Types/Types";

const initialForm: CourseData = {
  id: "",
  candidateName: "",
  courseName: "",
  courseId: "",
  startDate: "",
  endDate: "",
  description: "",
};

type ErrorState = Partial<Record<keyof CourseData | "date", string>>;

interface CourseFormProps {
  editData?: CourseData | null;
}

const CourseForm: React.FC<CourseFormProps> = ({ editData }) => {
  const [formData, setFormData] = useState<CourseData>(initialForm);
  const [errors, setErrors] = useState<ErrorState>({});
  const { addCourse, updateCourse } = useCourseContext();
  const navigate = useNavigate();

  const idRef = useRef<string>(crypto.randomUUID());

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData((prev) => ({
        ...prev,
        id: idRef.current,
        courseId: idRef.current,
      }));
    }
  }, [editData]);

  const validate = useCallback(() => {
    const newErrors: ErrorState = {};

    if (!formData.candidateName.trim()) newErrors.candidateName = "Candidate name is required";
    if (!formData.courseName.trim()) newErrors.courseName = "Course name is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) > new Date(formData.endDate)
    ) {
      newErrors.date = "Start date cannot be after end date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      if (editData) {
        updateCourse(formData);
      } else {
        addCourse({
          ...formData,
          id: idRef.current,
          courseId: idRef.current,
        });
      }

      setFormData(initialForm);
      navigate("/");
    },
    [formData, validate, editData, addCourse, updateCourse, navigate]
  );

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{editData ? "Edit Course" : "Create Course"}</h2>

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
          value={formData.courseId}
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
      </div>

      {errors.date && <span className="error">{errors.date}</span>}

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        {errors.description && <span className="error">{errors.description}</span>}
      </div>

      <button type="submit">{editData ? "Update Course" : "Add Course"}</button>
    </form>
  );
};

export default CourseForm;
