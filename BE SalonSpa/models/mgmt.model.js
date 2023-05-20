const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const configuration = require('../configs/configuration');

const managerSchemal = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users',
      required: true,
    },
    branch: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'branches',
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
  },
  {
    collection: 'managements',
    versionKey: false,
    timestamps: true,
  },
);

managerSchemal.pre('save', function (next) {
  const user = this;
  if (user.password) {
    user.password = bcryptjs.hashSync(user.password, configuration.SALT_ROUND);
  }
  next();
});

managerSchemal.pre('findOneAndUpdate', function (next) {
  const user = { ...this.getUpdate() };
  if (user.password) {
    user.password = bcryptjs.hashSync(user.password, configuration.SALT_ROUND);
  }
  this.setUpdate(user);
  next();
});

managerSchemal.pre('create', function (next) {
  const user = this;
  if (user.password) {
    user.password = bcryptjs.hashSync(user.password, configuration.SALT_ROUND);
  }
  next();
});

module.exports = mongoose.model('managements', managerSchemal);
