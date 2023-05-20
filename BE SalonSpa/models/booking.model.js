const mongoose = require('mongoose');

const BookingSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      default: Date.now(),
      required: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users',
    },
    services: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'services',
      },
    ],
    branch: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'branches',
      required: true,
    },
    amount: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
    status: {
      type: String,
      enum: ['Activated', 'Completed', 'Cancelled'],
      default: 'Activated',
    },
  },
  {
    collection: 'bookings',
    versionKey: false,
    timestamps: true,
  },
);

module.exports = mongoose.model('bookings', BookingSchema);
