const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Faq = require('../models/Faq');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI (with error handling)
let genAI, model;
try {
    if (!process.env.GEMINI_API_KEY) {
        console.warn('⚠️  GEMINI_API_KEY not found in environment variables');
    } else {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    }
} catch (error) {
    console.error('❌ Error initializing Gemini AI:', error.message);
}

// GET /faqs (Optional: to verify data)
router.get('/faqs', async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ 
                error: 'Database not connected', 
                message: 'MongoDB connection is not established. Please check your MONGO_URI and ensure MongoDB is running.' 
            });
        }

        const faqs = await Faq.find().sort({ id: 1 });
        
        if (!faqs || faqs.length === 0) {
            return res.status(404).json({ 
                error: 'No FAQs found', 
                message: 'Database is empty. Please run the seeder script: node server/utils/seeder.js' 
            });
        }

        console.log(`✅ Returning ${faqs.length} FAQs`);
        res.json(faqs);
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch FAQs', 
            message: error.message 
        });
    }
});

// POST /query (The Chatbot Logic)
router.post('/query', async (req, res) => {
    try {
        const { userQuestion } = req.body;
        
        if (!userQuestion) {
            return res.status(400).json({ error: "No question provided" });
        }

        console.log(`📩 Received query: "${userQuestion}"`);

        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            console.error('❌ Database not connected');
            return res.status(503).json({ 
                error: "Database not connected", 
                message: "MongoDB connection is not established. Please check your MONGO_URI." 
            });
        }

        // Check if Gemini is initialized
        if (!model) {
            console.error('❌ Gemini AI not initialized');
            return res.status(500).json({ 
                error: "AI service not available", 
                message: "GEMINI_API_KEY is missing or invalid. Please check your environment variables." 
            });
        }

        // 1. Fetch all FAQs from MongoDB (sorted by ID for consistency)
        const allFaqs = await Faq.find({}).sort({ id: 1 });
        
        if (!allFaqs || allFaqs.length === 0) {
            console.error('❌ No FAQs found in database');
            return res.status(500).json({ 
                error: "Database empty", 
                message: "No FAQs found in database. Please run: npm run seed in the server directory." 
            });
        }
        
        console.log(`📚 Fetched ${allFaqs.length} FAQs from database for context`);
        
        // 2. Format them as context for Gemini
        const contextData = allFaqs.map(f => `[ID:${f.id}] Q: ${f.question} A: ${f.answer}`).join("\n");

        // 3. Construct the Prompt with strict RAG instructions
        const prompt = `You are HealthiClick Bot, a helpful and friendly diet assistant.

IMPORTANT RULES:
1. You MUST answer the user's question using ONLY the information from the FAQ DATABASE provided below.
2. Find the FAQ entry that best matches the user's question or intent.
3. Provide the answer in a natural, friendly, and conversational way.
4. YOU MUST include the reference number at the end of your response in this exact format: "(Ref: Question #X)" where X is the FAQ ID number.
5. If the user's question doesn't match any FAQ in the database, politely say: "I'm sorry, I can only answer questions from my verified diet database. Please ask me about diet, nutrition, or health-related topics."
6. Do NOT make up information or use knowledge outside the provided FAQ database.
7. Keep your response concise and helpful.

FAQ DATABASE (${allFaqs.length} entries):
${contextData}

USER QUESTION: "${userQuestion}"

Now provide a helpful answer based on the FAQ database above:`;

        // 4. Call Gemini
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log(`✅ Generated response for query`);
        res.json({ answer: text });
    } catch (error) {
        console.error("❌ Error processing query:", error);
        
        // More detailed error handling
        if (error.message && error.message.includes('API key')) {
            return res.status(500).json({ 
                error: "Invalid API key",
                message: "GEMINI_API_KEY is invalid. Please check your environment variables."
            });
        }
        
        if (error.message && error.message.includes('network') || error.message && error.message.includes('ECONNREFUSED')) {
            return res.status(503).json({ 
                error: "Service unavailable",
                message: "Unable to connect to AI service. Please check your internet connection."
            });
        }
        
        res.status(500).json({ 
            error: "Failed to generate response",
            message: error.message || "Unknown error occurred. Please check server logs."
        });
    }
});

module.exports = router;