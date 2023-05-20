const mongoose = require('mongoose');

const typeBill = require('../constants/typeBill');

const billSchema = mongoose.Schema(
  {
    totalMoney: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    typePayment: {
      type: String,
    },
    paymentId: {
      type: String,
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
    idEmpBill: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'employees',
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'services',
      },
    ],
    bookings: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'bookings',
    },
    status: {
      type: String,
      enum: Object.keys(typeBill),
      default: typeBill.PENDING,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

module.exports = mongoose.model('bills', billSchema);
