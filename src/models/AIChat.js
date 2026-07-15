import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  method: { type: String, enum: ['groq', 'rule-engine'], default: 'groq' },
});

const aiChatSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    messages: [messageSchema],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    metadata: {
      userAgent: String,
      ipAddress: String,
    },
  },
  { timestamps: true }
);

const AIChat = mongoose.models.AIChat || mongoose.model('AIChat', aiChatSchema);
export default AIChat;
