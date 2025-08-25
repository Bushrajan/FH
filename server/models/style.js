import mongoose from 'mongoose';

const HijabStyle = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
});

export default mongoose.model('HijabStyle', HijabStyle);