
import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Electronics', 'Lifestyle', 'Accessories', 'Wellness', 'Home']
  },
  description: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: Number, default: 4.5 }
}, { timestamps: true });

export default models.Product || model('Product', ProductSchema);
