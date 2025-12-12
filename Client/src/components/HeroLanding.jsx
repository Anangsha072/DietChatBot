import { SignInButton } from "@clerk/clerk-react";
import BotImage from "../assets/Bot_Image.jpg";
import HeroImage from "../assets/Hero_Image.jpg";
import LandingHeader from "./LandingHeader";
import FAQSection from "./FAQSection";

const HeroLanding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <LandingHeader />

      {/* Hero Section - Single Page */}
      <section className="relative min-h-screen flex items-start justify-center overflow-hidden pt-20 sm:pt-24 md:pt-28 lg:pt-32">
        {/* Bot Image - Top Right Corner */}
        <div className="absolute top-16 right-4 sm:top-20 sm:right-6 md:top-24 md:right-8 lg:top-28 lg:right-12 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-52 lg:h-52 xl:w-64 xl:h-64 z-10">
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/20 border-4 border-purple-500/30 backdrop-blur-sm bg-slate-800/40 p-2">
            <img 
              src={BotImage} 
              alt="AI Bot" 
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Diet Image - Top Left Corner (moved up to match center content) */}
        <div className="absolute top-16 left-4 sm:top-20 sm:left-6 md:top-24 md:left-8 lg:top-28 lg:left-12 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-52 lg:h-52 xl:w-64 xl:h-64 z-10">
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/20 border-4 border-purple-500/30 backdrop-blur-sm bg-slate-800/40 p-2">
            <img 
              src={HeroImage} 
              alt="Healthy Diet" 
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Center Content - Moved Up Near Header */}
        <div className="relative z-20 text-center px-4 sm:px-6 max-w-4xl mx-auto flex flex-col items-center justify-start pt-8 sm:pt-12 md:pt-16">
          <div className="bg-slate-800/60 backdrop-blur-xl rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl shadow-purple-500/20 border border-purple-500/30">
            <div className="mb-4 sm:mb-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2 tracking-tight">
                Diet Health
              </h1>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-3 sm:mb-4 tracking-tight">
                Chatbot
              </h2>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-300 mt-3 sm:mt-4 max-w-2xl mx-auto leading-relaxed font-light px-2 sm:px-4">
                Your personal AI-powered nutrition assistant. Get expert diet advice, 
                meal planning tips, and answers to all your health questions.
              </p>
            </div>

            {/* Start Chat Button with Gradient */}
            <div className="mt-6 sm:mt-8">
              <SignInButton mode="modal">
                <button className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 hover:from-purple-600 hover:via-pink-600 hover:to-purple-600 text-white px-8 sm:px-12 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base md:text-lg font-medium shadow-xl shadow-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/60 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:translate-y-0 backdrop-blur-sm border border-purple-400/30">
                  Start Chat
                </button>
              </SignInButton>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-30 animate-bounce">
          <div className="flex flex-col items-center text-purple-400">
            <span className="text-xs sm:text-sm font-light mb-2">Scroll to see FAQs</span>
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <footer className="bg-slate-900/80 backdrop-blur-sm border-t border-purple-500/20 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            © 2025 HealthiClick. All rights reserved. Secure Login via Clerk.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HeroLanding;

