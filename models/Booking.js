const mongoose = require('mongoose');
const { type } = require('os');

const bookingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  space_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Space',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
   },
  totalPrice:{
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  paymentStatus: { type: String, default: 'Pending' },
  reference: { type: String, unique: true },
  // endDate: {
  //   type: Date,
  //   required: true
  // },
  // startTime: {
  //   type: Date,
  //   required: true
  // },
  // endTime: {
  //   type: Date,
  //   required: true
  // },
  // status: {
  //   type: String,
  //   enum: ['pending', 'confirmed', 'cancelled'],
  //   default: 'pending'
  // },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
