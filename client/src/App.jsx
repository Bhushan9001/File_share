import './App.css'
import UploadFile from './pages/UploadFile'
import FileDownload from './pages/FileDownload'
import { Route, Router, Routes } from 'react-router-dom'

function App() {


  return (
    <Routes>
        <Route index element={<UploadFile />} />
        <Route path='/download-file/:id' element={<FileDownload />} />
    </Routes>
  )
}

export default App
