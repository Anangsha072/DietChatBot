require('dotenv').config();
const mongoose = require('mongoose');
const Faq = require('../models/Faq');

const faqs = [
    { id: 1, question: "What is the ideal diet for weight loss?", answer: "A calorie-deficit diet with high protein, high fiber, and low sugar helps in healthy weight loss." },
    { id: 2, question: "What is the ideal diet for weight gain?", answer: "Eat more calories than you burn, including nuts, whole grains, dairy, and protein-rich foods." },
    { id: 3, question: "How many calories should I eat per day?", answer: "Most adults need 1,600–2,500 calories depending on age, gender, and activity." },
    { id: 4, question: "Is it necessary to count calories?", answer: "No, but calorie tracking helps control portions and stay consistent." },
    { id: 5, question: "What is a balanced diet?", answer: "A diet with carbs, protein, healthy fats, fruits, vegetables, and enough water." },
    { id: 6, question: "How much water should I drink daily?", answer: "2–3 liters per day, more if you sweat." },
    { id: 7, question: "Are supplements necessary?", answer: "Only if your diet lacks nutrients or a doctor recommends them." },
    { id: 8, question: "Is intermittent fasting effective?", answer: "Yes for many people, but not recommended for pregnant women or those with medical conditions." },
    { id: 9, question: "What is the best time to eat meals?", answer: "Eat every 3–4 hours and avoid heavy late-night meals." },
    { id: 10, question: "Are carbs bad?", answer: "No. Whole carbs are healthy; refined carbs should be limited." },
    { id: 11, question: "Why am I not losing weight even after dieting?", answer: "Possible reasons include hidden calories, poor sleep, stress, or lack of exercise." },
    { id: 12, question: "How to reduce belly fat?", answer: "Eat fewer calories, increase protein, reduce sugar, and do strength training." },
    { id: 13, question: "How much protein do I need for fat loss?", answer: "1.2–1.6 g per kg body weight daily." },
    { id: 14, question: "Can I lose weight without exercise?", answer: "Yes, but exercise makes fat loss faster and healthier." },
    { id: 15, question: "Why does my weight fluctuate?", answer: "Due to water retention, salt intake, digestion, and hormones." },
    { id: 16, question: "What diet is best for diabetes?", answer: "Low sugar, high fiber, controlled carbohydrates, and regular meals." },
    { id: 17, question: "What diet is best for high BP?", answer: "A low-salt diet with fruits, vegetables, and lean protein (DASH diet)." },
    { id: 18, question: "What should I eat for high cholesterol?", answer: "High-fiber foods like oats, nuts, fruits, and fewer fried foods." },
    { id: 19, question: "What diet helps with thyroid issues?", answer: "Balanced protein, iodine, and selenium; avoid excessive soy." },
    { id: 20, question: "What foods reduce inflammation?", answer: "Turmeric, berries, nuts, olive oil, and green tea." },
    { id: 21, question: "What should I eat before a workout?", answer: "A small meal with carbs and protein, like oats or a banana with peanut butter." },
    { id: 22, question: "What should I eat after a workout?", answer: "Protein plus carbs, like eggs, whey protein, chicken, or smoothies." },
    { id: 23, question: "Is whey protein safe?", answer: "Yes, for most people; it is a milk-based protein supplement." },
    { id: 24, question: "How to gain muscle naturally?", answer: "Eat high protein, lift weights, and sleep well." },
    { id: 25, question: "How much protein is too much?", answer: "More than 2.2 g per kg body weight daily may stress kidneys." },
    { id: 26, question: "What should I eat for acidity?", answer: "Bananas, coconut water, cucumbers; avoid spicy and fried foods." },
    { id: 27, question: "What should I eat for constipation?", answer: "Fiber-rich foods, fruits, vegetables, and plenty of water." },
    { id: 28, question: "Why do I feel bloated?", answer: "Eating too fast, heavy meals, or gas-producing foods." },
    { id: 29, question: "How to improve gut health?", answer: "Eat probiotics, fiber, hydrate well, and avoid junk food." },
    { id: 30, question: "Are probiotics useful?", answer: "Yes, they improve digestion and immunity." },
    { id: 31, question: "Is keto diet safe?", answer: "Short-term yes; long-term may cause nutrient deficiencies." },
    { id: 32, question: "Should I follow gluten-free diet?", answer: "Only if you are gluten intolerant or have celiac disease." },
    { id: 33, question: "Are vegan diets healthy?", answer: "Yes, if you ensure protein, B12, iron, and omega-3 intake." },
    { id: 34, question: "What is the Mediterranean diet?", answer: "A diet rich in vegetables, fruits, olive oil, and fish." },
    { id: 35, question: "Is detox dieting helpful?", answer: "No strong evidence; the body naturally detoxes." },
    { id: 36, question: "How many meals should I eat daily?", answer: "Three main meals and one or two healthy snacks." },
    { id: 37, question: "Are snacks healthy?", answer: "Yes, if you choose nuts, fruits, yogurt, or roasted foods." },
    { id: 38, question: "Is eating late at night harmful?", answer: "Yes, it may cause indigestion and fat gain." },
    { id: 39, question: "How to stop sugar cravings?", answer: "Eat enough protein, drink water, and avoid long meal gaps." },
    { id: 40, question: "Is tea or coffee harmful?", answer: "Not in moderation; limit sugar and cream." },
    { id: 41, question: "Do bananas cause weight gain?", answer: "No, bananas are healthy and do not cause fat gain by themselves." },
    { id: 42, question: "Is brown rice better than white rice?", answer: "Brown rice has more fiber, but portion size matters more." },
    { id: 43, question: "Should I avoid dairy?", answer: "Only if lactose intolerant; otherwise dairy is healthy." },
    { id: 44, question: "Are artificial sweeteners safe?", answer: "Safe in moderate amounts." },
    { id: 45, question: "Is fruit juice healthy?", answer: "Less healthy than whole fruits because juice has no fiber." },
    { id: 46, question: "What is the best diet for busy professionals?", answer: "Simple meals: eggs, fruits, nuts, yogurt, oats, salads, and meal-prepped dishes." },
    { id: 47, question: "What should I eat while traveling?", answer: "Nuts, fruits, protein bars, sandwiches, and water." },
    { id: 48, question: "How to plan meals for a week?", answer: "Prepare a list, batch-cook protein, and pre-cut vegetables." },
    { id: 49, question: "How to stay consistent with diet?", answer: "Keep meals simple, track progress, and avoid extreme dieting." },
    { id: 50, question: "How long to see results?", answer: "Usually 3–6 weeks with proper diet and discipline." }
];

const seedDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('❌ MONGO_URI not found in environment variables');
            console.error('Please create a .env file in the server directory with: MONGO_URI=your_mongodb_connection_string');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');
        
        await Faq.deleteMany({}); // Clear existing data
        console.log('🗑️  Old data cleared');
        
        await Faq.insertMany(faqs);
        console.log(`🌱 Database seeded with ${faqs.length} FAQs`);
        console.log('✅ Seeding completed successfully!');
        
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err.message);
        if (err.message.includes('ECONNREFUSED')) {
            console.error('💡 Tip: Make sure MongoDB is running and the connection string is correct.');
        }
        process.exit(1);
    }
};

seedDB();