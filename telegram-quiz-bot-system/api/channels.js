let channels = [
  {
    id: 'ch_1',
    name: 'CBSE 10th Science Notes',
    channelId: '@CBSE_10TH_SCIENCE_NOTES',
    discussionGroupId: '@CBSE_10TH_SCIENCE_DISCUSSION',
    category: 'Science',
    active: true,
    questionCount: 10,
    schedule: {
      time: '09:00',
      days: ['Monday', 'Wednesday', 'Friday']
    },
    lastQuizSent: null
  }
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      res.status(200).json({
        success: true,
        channels: channels,
        total: channels.length
      });
    } else if (req.method === 'POST') {
      const newChannel = {
        id: 'ch_' + Date.now(),
        ...req.body,
        active: true,
        lastQuizSent: null
      };
      channels.push(newChannel);
      
      res.status(201).json({
        success: true,
        message: 'Channel added successfully',
        channel: newChannel
      });
    } else if (req.method === 'PUT') {
      const { id, ...updateData } = req.body;
      const channelIndex = channels.findIndex(ch => ch.id === id);
      
      if (channelIndex === -1) {
        return res.status(404).json({ error: 'Channel not found' });
      }
      
      channels[channelIndex] = { ...channels[channelIndex], ...updateData };
      
      res.status(200).json({
        success: true,
        message: 'Channel updated successfully',
        channel: channels[channelIndex]
      });
    } else if (req.method === 'DELETE') {
      const { id } = req.body;
      const channelIndex = channels.findIndex(ch => ch.id === id);
      
      if (channelIndex === -1) {
        return res.status(404).json({ error: 'Channel not found' });
      }
      
      channels.splice(channelIndex, 1);
      
      res.status(200).json({
        success: true,
        message: 'Channel deleted successfully'
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};