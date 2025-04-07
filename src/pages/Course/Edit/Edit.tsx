import React, { useMemo } from "react";
import CourseForm from "../../../components/CourseForm/CourseForm";
import { useCourseContext } from "../../../contexts/CourseContext";
import { useSearchParams } from "react-router-dom";

const Edit: React.FC = () => {
  const { courses = [] } = useCourseContext();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("id");

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === courseId),
    [courses, courseId]
  );

  if (!courseId) {
    return <p>Invalid course ID.</p>;
  }

  return (
    <div>
      {selectedCourse ? (
        <CourseForm editData={selectedCourse} />
      ) : (
        <p>Course not found.</p>
      )}
    </div>
  );
};

export default Edit;
