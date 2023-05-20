const mongoose = require('mongoose');

const NotificationSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    idUser: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users',
    },
    idEmp: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'employees',
    },
    idMgmt: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'managements',
    },
    branch: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'branches',
    },
    type: {
      type: String,
      enum: ['BOOKING', 'PAYMENT', 'USER'],
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

module.exports = mongoose.model('notifications', NotificationSchema);
