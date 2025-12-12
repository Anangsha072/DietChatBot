import { useState, useEffect } from "react";
import axios from "axios";

const FAQSection = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const INITIAL_FAQS_TO_SHOW = 5;

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        // Determine API URL - ALWAYS use proxy in development
        // In Vite dev mode, use relative path to leverage proxy
        // In production, use full URL or env variable
        
        let apiUrl;
        const mode = import.meta.env.MODE;
        
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
        
        // Build FAQ URL - ensure proper formatting
        const faqUrl = apiUrl + '/faqs';
        
        console.log('Environment Debug:', {
          MODE: mode,
          DEV: import.meta.env.DEV,
          hostname: window.location.hostname,
          VITE_API_URL: import.meta.env.VITE_API_URL,
          'Final API URL': apiUrl
        });
        console.log('Full FAQ URL:', faqUrl);
        
        const response = await axios.get(faqUrl, {
          timeout: 10000, // 10 second timeout
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        console.log('FAQ Response:', response.data);
        
        // Ensure response.data is an array
        if (Array.isArray(response.data)) {
          if (response.data.length === 0) {
            setError('No FAQs found in database. Please seed the database first.');
          } else {
            setFaqs(response.data);
            setError(null);
          }
        } else {
          console.error('Invalid FAQ data format:', response.data);
          setError('Invalid data format received from server.');
          setFaqs([]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching FAQs:', err);
        
        // More detailed error messages
        if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
          setError('Cannot connect to server. Please ensure the backend server is running on http://localhost:5000');
        } else if (err.response) {
          // Server responded with error status
          setError(err.response?.data?.error || err.response?.data?.message || `Server error: ${err.response.status}`);
        } else if (err.request) {
          setError('No response from server. Please check if the backend is running.');
        } else {
          setError(err.message || 'Failed to load FAQs. Please try again later.');
        }
        setFaqs([]);
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const toggleFAQ = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="faq" className="relative z-20 py-16 px-6 bg-gradient-to-b from-slate-900 via-purple-900/50 to-slate-900">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-center mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-300 text-center mb-12 font-light">
          Get answers to common diet and nutrition questions
        </p>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            <p className="mt-4 text-gray-300">Loading FAQs...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-6 text-center max-w-2xl mx-auto backdrop-blur-sm">
            <p className="text-red-300 font-medium mb-2">⚠️ {error}</p>
            <p className="text-sm text-red-400 mt-2">
              Make sure the backend server is running and the database is seeded with FAQs.
            </p>
          </div>
        )}

        {!loading && !error && Array.isArray(faqs) && faqs.length > 0 && (
          <>
            <div className="space-y-4">
              {(showAll ? faqs : faqs.slice(0, INITIAL_FAQS_TO_SHOW)).map((faq, index) => {
                // Use _id from MongoDB if id is not available, or use index as fallback
                const faqId = faq.id || faq._id || index;
                return (
                  <div
                    key={faqId}
                    className="bg-slate-800/60 backdrop-blur-md border border-purple-500/30 rounded-xl shadow-lg shadow-purple-500/10 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFAQ(faqId)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-purple-500/10 transition-colors"
                    >
                      <span className="text-gray-200 font-medium pr-4">
                        {faq.question || 'Question not available'}
                      </span>
                      <span className="text-purple-400 text-xl flex-shrink-0">
                        {expandedId === faqId ? '−' : '+'}
                      </span>
                    </button>
                    {expandedId === faqId && (
                      <div className="px-6 pb-4 pt-2 border-t border-purple-500/20">
                        <p className="text-gray-300 leading-relaxed font-light">
                          {faq.answer || 'Answer not available'}
                        </p>
                        <p className="text-xs text-purple-400 mt-3 font-light">
                          Reference ID: #{faqId}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {faqs.length > INITIAL_FAQS_TO_SHOW && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {showAll ? `Show Less (${INITIAL_FAQS_TO_SHOW} FAQs)` : `Show All ${faqs.length} FAQs`}
                </button>
              </div>
            )}
          </>
        )}

        {!loading && !error && (!Array.isArray(faqs) || faqs.length === 0) && (
          <div className="text-center py-12">
            <p className="text-purple-600">No FAQs available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQSection;

