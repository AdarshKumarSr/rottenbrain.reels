import { useState } from "react";

export default function InputArea({ setVideoUrl, setIsGenerating }) {
  const [inputText, setInputText] = useState("");
  const [fileName, setFileName] = useState("");
  const [language, setLanguage] = useState("english");

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setVideoUrl(""); // Clear any old video

    setTimeout(() => {
      const demoReelUrl = "/reel.mp4"; // Simulate backend URL
      setVideoUrl(demoReelUrl);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-[297px]">
      {/* Drag & Drop - only on sm and up */}
      <div
        onDragOver={handleDrag}
        onDrop={handleDrag}
        className="hidden sm:flex flex-col items-center justify-center border-2 border-dashed border-[#3e3527] w-[297px] min-h-[300px] rounded-md p-4 text-center"
      >
        <label htmlFor="file-upload" className="cursor-pointer">
          <p className="text-lg font-bold">Upload File (.txt, .pdf)</p>
          <p className="text-sm text-gray-600 mt-2">
            {fileName ? `Uploaded: ${fileName}` : "Drag and drop or click to upload"}
          </p>
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".txt,.pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Dropdown for Language Selection */}
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="w-[297px] p-2 rounded bg-[#3e3527] text-white border border-[#3e3527] focus:outline-none focus:ring-2 focus:ring-[#3e3527] appearance-none"
      >
        <option value="english">English</option>
        <option value="hindi">Hindi</option>
        <option value="gujarati">Gujarati</option>
      </select>

      {/* Input Textarea */}
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Type text here..."
        className="w-[297px] h-24 p-4 border border-[#3e3527] rounded resize-none"
      />

      {/* Submit Button */}
      <button
        onClick={handleGenerate}
        disabled={!inputText.trim() && !fileName}
        className="bg-[#3e3527] text-white py-3 rounded w-[297px] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Generate
      </button>
    </div>
  );
}
