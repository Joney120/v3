const TelegramBot = require('node-telegram-bot-api');

const token = process.env.QUIZ_BOT_TOKEN || '6642298097:AAHXjwoFaTlP0Y7MuULbUoqHiUJOZO98v4k';
const bot = new TelegramBot(token);

const sampleQuestions = [
  {
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Au", "Ag", "Gd"],
    correct_answer: 1,
    explanation: "Au is the chemical symbol for gold.",
    reason: "Gold's chemical symbol 'Au' comes from its Latin name 'aurum', meaning 'shining dawn'."
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct_answer: 1,
    explanation: "Mars is known as the Red Planet.",
    reason: "Mars appears red due to iron oxide (rust) on its surface."
  },
  {
    question: "What is the largest organ in the human body?",
    options: ["Heart", "Brain", "Liver", "Skin"],
    correct_answer: 3,
    explanation: "The skin is the largest organ in the human body.",
    reason: "The skin covers the entire body and accounts for about 16% of total body weight."
  }
];

async function sendQuizPoll(channelId, question) {
  try {
    const poll = await bot.sendPoll(channelId, question.question, question.options, {
      type: 'quiz',
      correct_option_id: question.correct_answer,
      explanation: question.explanation,
      is_anonymous: false
    });
    
    return { success: true, poll };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'POST') {
      const { channelId, questionData } = req.body;
      
      if (!channelId) {
        return res.status(400).json({ error: 'Channel ID is required' });
      }

      const question = questionData || sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
      const result = await sendQuizPoll(channelId, question);
      
      res.status(200).json(result);
    } else {
      res.status(200).json({
        success: true,
        message: 'Quiz Bot API is working',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};