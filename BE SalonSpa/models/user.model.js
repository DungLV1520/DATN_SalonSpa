const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const configuration = require('../configs/configuration');
const listStatus = require('../constants/statusUser');
const typeRole = require('../constants/typeRole');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
    },
    gender: {
      type: String,
      default: 'Male',
    },
    phone: {
      type: String,
      unique: true,
    },
    uid: {
      type: String,
    },
    providerId: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.keys(typeRole),
      default: typeRole.USER,
    },
    status: {
      type: String,
      enum: Object.keys(listStatus),
      default: listStatus.PendingVerify,
      required: true,
    },
  },
  {
    collection: 'users',
    versionKey: false,
    timestamps: true,
  },
);

userSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.password;
  },
});

userSchema.pre('save', function (next) {
  const user = this;
  if (user.password) {
    user.password = bcryptjs.hashSync(user.password, configuration.SALT_ROUND);
  }
  next();
});

userSchema.pre('create', function (next) {
  const user = this;
  if (user.password) {
    user.password = bcryptjs.hashSync(user.password, configuration.SALT_ROUND);
  }
  next();
});

userSchema.pre('findOneAndUpdate', function (next) {
  const user = { ...this.getUpdate() };
  if (user.password) {
    user.password = bcryptjs.hashSync(user.password, configuration.SALT_ROUND);
  }
  this.setUpdate(user);
  next();
});

userSchema.pre('update', function (next) {
  const user = { ...this.getUpdate() };
  if (user.password) {
    user.password = bcryptjs.hashSync(user.password, configuration.SALT_ROUND);
  }
  this.setUpdate(user);
  next();
});

module.exports = mongoose.model('users', userSchema);
