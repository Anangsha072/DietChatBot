import { SignInButton } from "@clerk/clerk-react";

const LandingHeader = () => {
  return (
    <header className="bg-slate-800/70 backdrop-blur-xl border-b border-purple-500/30 px-6 py-4 flex justify-between items-center z-30 shadow-lg shadow-purple-500/20 sticky top-0">
      {/* Left Side: Logo & Branding */}
      <div className="flex items-center gap-3">
        <span className="text-3xl" role="img" aria-label="salad">🥗</span>
        <div>
          <h1 className="text-xl font-light text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 tracking-tight">
            HealthiClick
          </h1>
          <p className="text-xs text-gray-300 font-light">
            Diet Health Chatbot
          </p>
        </div>
      </div>

      {/* Right Side: FAQ Button & Sign In Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            const faqSection = document.getElementById('faq');
            if (faqSection) {
              faqSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="bg-slate-700/60 hover:bg-slate-700 text-purple-300 hover:text-purple-200 px-6 py-2 rounded-lg text-sm font-normal shadow-md hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 backdrop-blur-sm border border-purple-500/30"
        >
          FAQ
        </button>
        <SignInButton mode="modal">
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-all duration-300 transform hover:scale-105">
            Sign In
          </button>
        </SignInButton>
      </div>
    </header>
  );
};

export default LandingHeader;

