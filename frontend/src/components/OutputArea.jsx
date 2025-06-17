export default function OutputArea({ videoUrl, isGenerating }) {
  return (
    <div className="bg-[#3e3527] text-white w-full min-w-[297px] max-w-[297px] h-[551px] rounded p-4 overflow-y-auto flex items-center justify-center">
      {isGenerating && <p className="text-center">Generating reel...</p>}

      {!isGenerating && videoUrl && (
        <video
          src={videoUrl}
          controls
          autoPlay
          className="rounded max-h-full max-w-full object-contain"
        />
      )}

      {!isGenerating && !videoUrl && (
        <p className="text-center text-sm text-gray-300">Generated output will appear here</p>
      )}
    </div>
  );
}
