import React from "react";
import CourseForm from "../../../components/CourseForm/CourseForm";
import { useCourseContext } from "../../../contexts/CourseContext";
import { useSearchParams } from "react-router-dom";

const Edit: React.FC = () => {
  const { courses } = useCourseContext();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const selectedCourse = courses.find((course) => course.id === id);
  console.log(selectedCourse)
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
