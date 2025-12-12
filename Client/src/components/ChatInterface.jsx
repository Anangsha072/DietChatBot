import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

const ChatInterface = () => {
  const { user } = useUser();
  
  // Load conversation history from localStorage on mount
  const loadHistory = () => {
    const saved = localStorage.getItem(`chat_history_${user?.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const initialMessage = {
    text: `Hi ${user?.firstName || 'there'}! Ask me anything about diet, nutrition, or weight loss.`,
    sender: "bot",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const [messages, setMessages] = useState(() => {
    const history = loadHistory();
    return history && history.length > 0 ? history : [initialMessage];
  });
  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Save conversation history to localStorage whenever messages change
  useEffect(() => {
    if (user?.id && messages.length > 0) {
      localStorage.setItem(`chat_history_${user?.id}`, JSON.stringify(messages));
    }
  }, [messages, user?.id]);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { text: input, sender: "user", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Determine API URL - ALWAYS use proxy in development
      // In Vite dev mode, use relative path to leverage proxy
      // In production, use full URL or env variable
      
      let apiUrl;
      const mode = import.meta.env.MODE;
      const isDev = import.meta.env.DEV !== false; // Default to true in dev
      
      // Force use of proxy in development (Vite dev server)
      if (mode === 'development' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        apiUrl = '/api'; // Use Vite proxy
      } else if (import.meta.env.VITE_API_URL) {
        apiUrl = import.meta.env.VITE_API_URL; // Use env variable in production
      } else {
        apiUrl = 'http://localhost:5000/api'; // Fallback
      }
      
      // Clean up URL - remove any trailing slashes
      apiUrl = apiUrl.trim().replace(/\/+$/, '');
      
      // Build query URL - ensure proper formatting
      const queryUrl = apiUrl + '/query';
      
      console.log('Environment Debug:', {
        MODE: mode,
        DEV: import.meta.env.DEV,
        hostname: window.location.hostname,
        VITE_API_URL: import.meta.env.VITE_API_URL,
        'Final API URL': apiUrl
      });
      console.log('Full Query URL:', queryUrl);
      console.log('Question:', userMsg.text);
      
      let response;
      try {
        response = await axios.post(queryUrl, {
          userQuestion: userMsg.text,
        }, {
          timeout: 30000, // 30 second timeout for AI responses
          headers: {
            'Content-Type': 'application/json',
          }
        });
        console.log('Response received:', response.data);
      } catch (proxyError) {
        // If proxy fails (404), try direct connection to backend
        if (proxyError.response?.status === 404 && apiUrl === '/api') {
          console.warn('Proxy failed, trying direct connection...');
          const directUrl = 'http://localhost:5000/api/query';
          response = await axios.post(directUrl, {
            userQuestion: userMsg.text,
          }, {
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json',
            }
          });
          console.log('Direct connection successful:', response.data);
        } else {
          throw proxyError; // Re-throw if it's not a 404 or not using proxy
        }
      }

      const botMsg = { 
        text: response.data.answer, 
        sender: "bot", 
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('API Error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status
      });
      
      let errorMsg = "Error connecting to server. Please check if the server is running.";
      
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        errorMsg = "Cannot connect to server. Please ensure the backend server is running on http://localhost:5000";
      } else if (error.response?.data?.error) {
        errorMsg = `Error: ${error.response.data.error}${error.response.data.message ? ' - ' + error.response.data.message : ''}`;
      } else if (error.response?.data?.message) {
        errorMsg = `Error: ${error.response.data.message}`;
      } else if (error.message) {
        errorMsg = `Error: ${error.message}`;
      }
      
      setMessages(prev => [...prev, { 
        text: errorMsg, 
        sender: "bot",
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-800 to-slate-900">
      
      {/* Messages List - Left Aligned (User and System messages) */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className="flex justify-start items-start gap-3">
            {/* Avatar/Icon for message type */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              msg.sender === "user" 
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50" 
                : "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/50"
            }`}>
              {msg.sender === "user" ? "U" : "B"}
            </div>
            
            {/* Message Bubble */}
            <div className={`flex-1 max-w-[85%] px-5 py-3.5 rounded-2xl shadow-lg ${
                msg.sender === "user" 
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-bl-sm shadow-purple-500/30" 
                  : "bg-slate-700/80 backdrop-blur-sm text-gray-100 border border-purple-500/20 rounded-br-sm shadow-purple-500/20"
              }`}>
              {/* Message Text */}
              <p className="leading-relaxed text-sm md:text-base whitespace-pre-wrap break-words">
                {msg.text}
              </p>
              
              {/* Timestamp - Optional but included for better UX */}
              <span className={`text-[10px] block mt-2 ${msg.sender === 'user' ? 'text-purple-100' : 'text-gray-400'}`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
        
        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-700/80 backdrop-blur-sm px-5 py-3.5 rounded-2xl rounded-br-sm border border-purple-500/20 shadow-lg">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Bottom Fixed */}
      <div className="p-4 bg-slate-800/90 backdrop-blur-sm border-t border-purple-500/30 shadow-2xl">
        <div className="flex items-center gap-3 bg-slate-700/80 rounded-xl px-4 py-3 border-2 border-purple-500/30 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/50 transition-all shadow-lg">
          <input
            type="text"
            className="flex-1 bg-transparent border-none focus:ring-0 text-gray-100 placeholder-gray-400 outline-none text-sm md:text-base"
            placeholder="Type your question about diet, nutrition, or health..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2.5 rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transform hover:scale-105 active:scale-95"
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;