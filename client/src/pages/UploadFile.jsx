import axios from "axios";
import React, { useState } from "react";

const UploadFile = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [downloadLink, setDownloadLink] = useState(""); // State to store download link

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    setLoading(true);
    setMessage("");
    setDownloadLink(""); // Reset download link when uploading a new file

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("password", password);

      const response = await axios.post("http://localhost:8080/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setMessage("File uploaded successfully!");
        setFile(null);
        setPassword("");
        setDownloadLink(`http://localhost:5173/download-file/${response.data.id}`); // Assume backend sends { downloadLink: "URL" }
      } else {
        setMessage("Failed to upload the file. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("An error occurred while uploading. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (downloadLink) {
      navigator.clipboard.writeText(downloadLink);
      setMessage("Download link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">File Share</h1>

      <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-lg">
        {/* Drag and Drop Area */}
        <div
          className={`relative w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-500 transition ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="text-center">
              <p className="text-lg font-medium text-gray-800">File Uploaded:</p>
              <p className="mt-2 text-blue-500 font-semibold">{file.name}</p>
            </div>
          ) : (
            <p className="text-center text-lg">
              {dragActive ? "Drop your file here" : "Drag & drop a file here, or click to browse"}
            </p>
          )}
          <input
            type="file"
            className="absolute w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileInputChange}
          />
        </div>

        {/* Password Input */}
        <div className="mt-6">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          className={`mt-6 w-full py-2 px-4 rounded-lg shadow ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
          }`}
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload File"}
        </button>

        {/* Feedback Message */}
        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes("successfully") || message.includes("copied")
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        {/* Download Link Section */}
        {downloadLink && (
          <div className="mt-6 text-center">
            <p className="text-gray-800">Your file is ready for download:</p>
            <a
              href={downloadLink}
              target="_blank"
            //   rel="noopener noreferrer"
              className="text-blue-500 font-medium underline mt-2 block"
            >
              Click here to download
            </a>
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
              onClick={handleCopyLink}
            >
              Copy Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadFile;
