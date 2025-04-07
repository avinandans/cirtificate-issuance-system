import React from "react";
import "./CourseTable.scss";
import { useCourseContext } from "../../contexts/CourseContext";
import { Link } from "react-router-dom";


const CourseTable: React.FC = () => {
  const { courses, deleteCourse } = useCourseContext();
  if (courses.length === 0) {
    return <p className="empty-message">No courses created yet.</p>;
  }

  return (
    <div className="course-table-wrapper">
      <table className="course-table">
        <thead>
          <tr>
            <th>Candidate Name</th>
            <th>Course Name</th>
            <th>Course ID</th>
            <th>Dates</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {courses.map((course, index) => (
            <tr key={index}>
              <td>{course.candidateName}</td>
              <td>{course.courseName}</td>
              <td>{course.courseId}</td>
              <td>
                {course.startDate} → {course.endDate}
              </td>
              <td>{course.description}</td>
              <td>
                <Link to={`/course/edit?id=${course.id}`} className="edit-btn">
                  Edit
                </Link>
                <button className="delete-btn" onClick={() => deleteCourse(index)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseTable;
