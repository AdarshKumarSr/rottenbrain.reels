import { useState } from "react";
import Sidebar from "./components/Sidebar";
import OutputArea from "./components/OutputArea";
import InputArea from "./components/InputArea";
import Navbar from "./components/Navbar";
import './assets/react.svg';
export default function App() {
  const [videoUrl, setVideoUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [userInfo, setUserInfo] = useState({
  username: "Jayesh",
  logedIn: true,
  user_profile_img: "react.svg"
});

const toggleLogin = () => {
  setUserInfo(prev => ({ ...prev, logedIn: !prev.logedIn }));
};

  return (
    <div className="bg-[#f7f3e8] flex flex-col min-h-screen font-sans text-[#2e271c] min-w-screen">
      <Navbar user_info={userInfo} onLoginToggle={toggleLogin} />

      <div className="flex flex-1 w-full">
        {/* Sidebar on desktop only */}
        <div className="hidden sm:block">
          <Sidebar />
        </div>

        {/* Main content area */}
        <main className="flex flex-1 flex-col sm:flex-row gap-[25px] p-6 items-center justify-center sm:items-start">
          {/* Output on left for desktop, bottom for mobile */}
          <OutputArea
            videoUrl={videoUrl}
            isGenerating={isGenerating}
            className="sm:w-[297px] w-full"
          />

          {/* InputArea handles input and controls */}
          <InputArea
            setVideoUrl={setVideoUrl}
            setIsGenerating={setIsGenerating}
          />
        </main>
      </div>

      <footer className="text-sm text-right pr-4 pb-2 text-[#fff] bg-[#2e271c]">
        Designed By Jayesh Suthar
      </footer>
    </div>
  );
}
