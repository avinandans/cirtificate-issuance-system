import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/index.scss'
import App from './App.tsx'
import { CourseProvider } from './contexts/CourseContext.tsx'
import { PDFEditorProvider } from './contexts/PDFEditorContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CourseProvider>
      <PDFEditorProvider>
        <App />
      </PDFEditorProvider>
    </CourseProvider>
  </StrictMode>,
)
