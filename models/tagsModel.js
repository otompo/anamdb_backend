import mongoose from 'mongoose';

const { Schema } = mongoose;

const tagSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Tag', tagSchema);
