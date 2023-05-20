const Service = require('../models/service.model');

exports.calculateTotalAmount = async (services, quantity, discount = null) => {
  let totalAmount = 0;
  for (let _id of services) {
    let service = await Service.findById(_id);
    totalAmount += +service.amount;
  }
  // totalAmount *= quantity;

  if (discount) {
    totalAmount = totalAmount - totalAmount * (discount / 100);
  }
  return totalAmount;
};
