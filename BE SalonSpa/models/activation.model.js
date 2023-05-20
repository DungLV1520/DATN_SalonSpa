const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const configuration = require('../configs/configuration');

const activationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users',
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    time: {
      type: Date,
      default: Date.now(),
      index: {
        expires: 1800, //remove row after 30mins
      },
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'activation_otp',
  },
);

activationSchema.pre('save', function (next) {
  const otp = this;
  if (otp.code) {
    otp.code = bcryptjs.hashSync(otp.code, configuration.SALT_ROUND);
  }
  next();
});

module.exports = mongoose.model('activation_otp', activationSchema);
