import { UserButton } from "@clerk/clerk-react";

const Header = () => {
  return (
    <header className="bg-slate-800/90 backdrop-blur-md border-b border-purple-500/30 px-6 py-4 flex justify-between items-center z-10 shadow-lg shadow-purple-500/20">
      {/* Left Side: Logo & Branding */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label="salad">🥗</span>
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 tracking-tight">
            HEALTHICLICK <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-normal">BOT</span>
          </h1>
        </div>
        {/* Copyright Tagline */}
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-1">
          © 2025 HealthiClick. All rights reserved.
        </p>
      </div>

      {/* Right Side: User Profile */}
      <div className="flex items-center gap-4">
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
};

export default Header;