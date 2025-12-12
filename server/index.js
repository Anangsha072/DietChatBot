require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

// CORS configuration - allow all origins for development
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
}));

app.use(express.json());

// Health check route
app.get('/', (req, res) => {
    res.json({ 
        status: 'Server is running', 
        message: 'HealthiClick Bot API',
        endpoints: {
            health: '/',
            faqs: '/api/faqs',
            query: '/api/query (POST)'
        }
    });
});

// Routes
app.use('/api', chatRoutes);

// Connect DB & Start Server
const PORT = process.env.PORT || 5000;

// Start server first, then connect to DB
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/`);
    
    // Connect to MongoDB
    if (!process.env.MONGO_URI) {
        console.error('❌ MONGO_URI not found in environment variables');
        return;
    }
    
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('✅ MongoDB Connected'))
        .catch(err => {
            console.error('❌ MongoDB Connection Error:', err.message);
            console.error('⚠️  Server is running but database is not connected');
        });
});