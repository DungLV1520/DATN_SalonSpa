const mongoose = require('mongoose');

const branchSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  {
    collection: 'branches',
    versionKey: false,
    timestamps: true,
  },
);

module.exports = mongoose.model('branches', branchSchema);
