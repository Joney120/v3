const TelegramBot = require('node-telegram-bot-api');

const token = process.env.ANSWER_BOT_TOKEN || '6233735663:AAF6ULU2C0XAcyaKhXU6G7Bg39EXTVXWUwU';
const bot = new TelegramBot(token);

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
      const { discussion_group_id, question_data } = req.body;
      
      if (!discussion_group_id || !question_data) {
        return res.status(400).json({
          error: 'Missing required fields'
        });
      }

      const answerMessage = `🎯 Quiz Answer

❓ Question: ${question_data.question}

✅ Correct Answer: ${question_data.options[question_data.correct_answer]}

💡 Explanation: ${question_data.explanation}

📝 Detailed Reason: ${question_data.reason}`;

      const result = await bot.sendMessage(discussion_group_id, answerMessage);
      res.status(200).json({ success: true, result });
    } else {
      res.status(200).json({
        success: true,
        message: 'Answer Bot API is working',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};