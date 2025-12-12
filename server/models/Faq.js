const mongoose = require('mongoose');

const FaqSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

module.exports = mongoose.model('Faq', FaqSchema);