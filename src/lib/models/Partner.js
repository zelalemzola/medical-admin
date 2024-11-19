import mongoose from 'mongoose';

const PartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String,
    required: true,
  },
  photoKey: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Partner || mongoose.model('Partner', PartnerSchema);
