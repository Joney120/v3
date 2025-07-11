const TelegramBot = require('node-telegram-bot-api');

const QUIZ_BOT_TOKEN = process.env.QUIZ_BOT_TOKEN || '6642298097:AAHXjwoFaTlP0Y7MuULbUoqHiUJOZO98v4k';
const ANSWER_BOT_TOKEN = process.env.ANSWER_BOT_TOKEN || '6233735663:AAF6ULU2C0XAcyaKhXU6G7Bg39EXTVXWUwU';

const quizBot = new TelegramBot(QUIZ_BOT_TOKEN);
const answerBot = new TelegramBot(ANSWER_BOT_TOKEN);

const sampleQuestions = [
  {
    question: "What is the speed of light in vacuum?",
    options: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "100,000 km/s"],
    correct_answer: 0,
    explanation: "The speed of light in vacuum is approximately 300,000 km/s.",
    reason: "The speed of light in vacuum is exactly 299,792,458 meters per second, approximately 300,000 km/s."
  },
  {
    question: "Which element has the atomic number 1?",
    options: ["Helium", "Hydrogen", "Lithium", "Carbon"],
    correct_answer: 1,
    explanation: "Hydrogen has the atomic number 1.",
    reason: "Hydrogen is the simplest element with one proton, giving it atomic number 1."
  }
];

const scheduledChannels = [
  {
    channelId: '@CBSE_10TH_SCIENCE_NOTES',
    discussionGroupId: '@CBSE_10TH_SCIENCE_DISCUSSION',
    channelName: 'CBSE 10th Science Notes',
    active: true
  }
];

async function sendScheduledQuiz(channel) {
  try {
    const question = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
    
    const poll = await quizBot.sendPoll(channel.channelId, question.question, question.options, {
      type: 'quiz',
      correct_option_id: question.correct_answer,
      explanation: question.explanation,
      is_anonymous: false
    });

    // Post answer to discussion group after 3 seconds
    setTimeout(async () => {
      if (channel.discussionGroupId) {
        const answerMessage = `🎯 Quiz Answer for ${channel.channelName}

❓ Question: ${question.question}

✅ Correct Answer: ${question.options[question.correct_answer]}

💡 Explanation: ${question.explanation}

📝 Detailed Reason: ${question.reason}

🕐 Posted at: ${new Date().toLocaleString()}`;

        try {
          await answerBot.sendMessage(channel.discussionGroupId, answerMessage);
        } catch (error) {
          console.error('Error posting answer:', error);
        }
      }
    }, 3000);

    return { success: true, poll, channel: channel.channelName };
  } catch (error) {
    return { success: false, error: error.message, channel: channel.channelName };
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
    const results = [];
    
    for (const channel of scheduledChannels) {
      if (channel.active) {
        const result = await sendScheduledQuiz(channel);
        results.push(result);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Quiz trigger completed successfully',
      timestamp: new Date().toISOString(),
      results: results,
      totalQuizzesSent: results.filter(r => r.success).length,
      totalChannels: scheduledChannels.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};