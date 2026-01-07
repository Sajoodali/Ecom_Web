
import mongoose, { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema({
  id: { type: String, required: true, unique: true },
  customer: { type: String, required: true },
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Processing', 'Shipped', 'Delivered'],
    default: 'Processing' 
  },
  date: { type: String, required: true },
  items: [{
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }]
}, { timestamps: true });

export default models.Order || model('Order', OrderSchema);
