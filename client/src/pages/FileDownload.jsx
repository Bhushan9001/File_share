import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function FileDownload() {
  //   const [fileId, setFileId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fileId = useParams().id;

  const handleDownload = async () => {
    if (!fileId) {
      setMessage("File ID is required.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.get(
        `http://localhost:8080/download/${fileId}`, // Replace with your backend endpoint
        {
          params: { password },
          responseType: "blob", // Ensures the file is downloaded as a binary stream
        }
      );

      // Create a URL for the downloaded file
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Extract the original filename from the Content-Disposition header
      const contentDisposition = response.headers["content-disposition"];
      console.log("Content-Disposition:", contentDisposition);
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : "downloaded_file";
      console.log("Extracted Filename:", filename);


      // Create a link to download the file with the correct name
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename); // Set the original file name
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage("File downloaded successfully!");
    } catch (error) {
      console.error("Error downloading file:", error);

      if (error.response) {
        setMessage(error.response.data.message || "Failed to download the file.");
      } else {
        setMessage("An error occurred while downloading. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Download File</h1>

      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        {/* File ID Input */}
        {/* <div className="mb-4">
          <label htmlFor="fileId" className="block text-gray-700 font-medium mb-2">
            File ID
          </label>
          <input
            type="text"
            id="fileId"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter the file ID"
            value={fileId}
            onChange={(e) => setFileId(e.target.value)}
          />
        </div> */}

        {/* Password Input */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter the password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Download Button */}
        <button
          className={`w-full py-2 px-4 rounded-lg shadow ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
            }`}
          onClick={handleDownload}
          disabled={loading}
        >
          {loading ? "Downloading..." : "Download File"}
        </button>

        {/* Feedback Message */}
        {message && (
          <p
            className={`mt-4 text-center ${message.includes("successfully") ? "text-green-500" : "text-red-500"
              }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default FileDownload;
