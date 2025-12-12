import { SignedIn, SignedOut } from "@clerk/clerk-react";
import ChatInterface from "./components/ChatInterface";
import Header from "./components/Header";
import HeroLanding from "./components/HeroLanding";

function App() {
  return (
    <div className="w-full min-h-screen font-sans">
      
      {/* ---------------- LANDING PAGE ---------------- */}
      <SignedOut>
        <HeroLanding />
      </SignedOut>

      {/* ---------------- CHAT APP SCREEN ---------------- */}
      <SignedIn>
        <div className="h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
          <div className="w-full h-full md:h-[90vh] md:w-[800px] md:rounded-2xl md:shadow-2xl md:shadow-purple-500/20 bg-slate-800 flex flex-col overflow-hidden border border-purple-500/30">
            {/* Use the new Header Component here */}
            <Header />
            
            {/* Main Chat Area */}
            <main className="flex-1 overflow-hidden relative bg-slate-900">
              <ChatInterface />
            </main>
          </div>
        </div>
      </SignedIn>
      
    </div>
  );
}

export default App;