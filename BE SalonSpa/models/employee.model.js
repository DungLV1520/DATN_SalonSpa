const mongoose = require('mongoose');

const employeeSchema = mongoose.Schema(
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
    job: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'employees',
    versionKey: false,
    timestamps: true,
  },
);

module.exports = mongoose.model('employees', employeeSchema);
