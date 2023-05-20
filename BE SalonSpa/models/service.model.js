const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    amount: {
      type: mongoose.Types.Decimal128,
      requried: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Pending', 'Reject'],
      default: 'Pending',
    },
  },
  {
    colection: 'services',
    versionKey: false,
    timestamps: true,
  },
);

module.exports = mongoose.model('services', serviceSchema);
