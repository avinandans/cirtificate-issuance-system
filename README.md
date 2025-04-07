#Certificate Issuance System (React.js)

A mobile-responsive Certificate Issuance System built using React.js that allows users to:
Create and manage certification course details.
Upload a PDF certificate template.
Drag and drop QR code and certificate details (like candidate name, course name, etc.) onto the PDF.
Preview and download the final certificate as a new PDF.

*Features

1. Course Creation
  Fill in Candidate Name, Course Name, Course ID, Dates, and Description.
  Form validation included (without Formik/Yup).
  View courses in a table with edit and delete options.

2. PDF Upload + Editor
  Upload your certificate background (PDF file).
  Render the PDF in the browser.
  Drag and drop:
  QR code (auto-generated from Course ID)
  Candidate Name
  Course Name
  Course ID
  Tenure Dates
  Description
  Positions are saved to local storage.
  Responsive UI

3. Certificate Export
  Live preview of certificate.
  Download final certificate as a PDF with all data in place.

#Tech Stack
  React.js 
  SCSS for styling
  react-pdf for PDF rendering
  qrcode.react for QR code generation
  html2canvas + jsPDF for PDF export

#Setup Instructions
1. Clone the Repository
   git clone https://github.com/avinandans/cirtificate-issuance-system.git
2. Install Dependencies
   npm install
3. Start the Application
  npm run dev

#Live Demo URL
https://cirtificate-issuance-system-f42s.vercel.app/certificate/fill-details
