export type CourseData = {
    id: string;
    candidateName: string;
    courseName: string;
    courseId: string;
    startDate: string;
    endDate: string;
    description: string;
};

export interface CourseContextType {
    courses: CourseData[];
    addCourse: (course: CourseData) => void;
    deleteCourse: (index: number) => void;
    updateCourse: (course: CourseData) => void;
    setCourses: React.Dispatch<React.SetStateAction<CourseData[]>>;
}
  