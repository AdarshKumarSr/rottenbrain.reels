import { useState } from "react";
import { Menu, X } from "lucide-react"; // optional: install `lucide-react` icons

const Navbar = ({ user_info, onLoginToggle }) => {
  const { username, logedIn, user_profile_img } = user_info;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-[#f7f3e8] text-[#2e271c] border-b border-[#2e271c]/20">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="text-2xl font-bold">BrainRot</div>

        {/* Mobile Menu Toggle Button */}
        <div className="sm:hidden">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="focus:outline-none">
            {mobileOpen ? <X size={24} color="white" /> : <Menu size={24} color="white"/>}
          </button>
        </div>

        {/* Desktop Nav */}
        <div className="hidden sm:flex items-center gap-4 text-sm sm:text-base">
          <a href="#" className="hover:underline font-medium" style={{ textDecoration:"None", color:"black"}}>Home</a>
          <a href="#" className="hover:underline font-medium" style={{ textDecoration:"None", color:"black"}}>Generate</a>

          <div className="flex items-center gap-3">
            <button
              onClick={onLoginToggle}
              className="bg-grey text-white px-3 py-1 rounded hover:opacity-90 transition-opacity"
            >
              {logedIn ? "Log out" : "Log in"}
            </button>

            <span>{username}</span>
            <img
              src={user_profile_img}
              alt={`${username}'s profile`}
              onError={(e) => (e.currentTarget.src = "https://img.freepik.com/premium-vector/woman-portrait-round-frame-avatar-female-character_559729-538.jpg")}
              className="w-8 h-8 rounded-full border border-[#2e271c]/30 object-cover"
            />
          </div>
        </div>
      </div>

      {/* Mobile Nav Links */}
      {mobileOpen && (
        <div className="flex flex-col gap-4 px-6 pb-4 sm:hidden text-sm" style={{ textDecoration:"None", color:"black"}}>
          <a href="#" className="hover:underline font-medium" style={{ textDecoration:"None", color:"black"}}>Home</a>
          <a href="#" className="hover:underline font-medium" style={{ textDecoration:"None", color:"black"}}>Generate</a>
          <button
            onClick={onLoginToggle}
            className="bg-grey text-white px-3 py-2 rounded hover:opacity-90 transition-opacity w-fit"
          >
            {logedIn ? "Log out" : "Log in"}
          </button>
          <div className="flex items-center gap-2">
            <span>{username}</span>
            <img
              src={user_profile_img}
              alt={`${username}'s profile`}
              onError={(e) => (e.currentTarget.src = "https://img.freepik.com/premium-vector/woman-portrait-round-frame-avatar-female-character_559729-538.jpg")}
              className="w-8 h-8 rounded-full border border-[#2e271c]/30 object-cover"
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
