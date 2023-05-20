const mongoose = require('mongoose');

const configuration = require('./configuration');
const userModel = require('../models/user.model');

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(configuration.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    let ad = await userModel.findOne({
      email: configuration.USER_ADMIN.email,
    });
    if (!ad) {
      await userModel.create(configuration.USER_ADMIN);
      console.log('Administrator created');
    }

    console.log('Database connection successful');
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
