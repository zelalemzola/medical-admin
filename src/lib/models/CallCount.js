import mongoose from 'mongoose';

const CallCountSchema = new mongoose.Schema({
  numberOfCalls: {
    type: Number,
    required: true,
    default: 0,
  },
});

export default mongoose.models.CallCount || mongoose.model('CallCount', CallCountSchema);
