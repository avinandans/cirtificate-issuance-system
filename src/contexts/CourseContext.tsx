import React, { createContext, useContext, useState } from "react";
import { CourseContextType, CourseData } from "../components/Types/Types";

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<CourseData[]>([]);

  const addCourse = (course: CourseData) => {
    setCourses((prev) => [...prev, course]);
  };

  const deleteCourse = (index: number) => {
    setCourses((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCourse = (updatedCourse: CourseData) => {
    setCourses((prev) =>
      prev.map((course) => (course.id === updatedCourse.id ? updatedCourse : course))
    );
  };

  return (
    <CourseContext.Provider
      value={{ courses, addCourse, deleteCourse, updateCourse, setCourses }}
    >
      {children}
    </CourseContext.Provider>
  );
};

// Custom Hook
export const useCourseContext = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourseContext must be used within CourseProvider");
  }
  return context;
};
