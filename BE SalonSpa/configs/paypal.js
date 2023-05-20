const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AbFQ9OEkNnwv74IsDoZySdsd02lNwCcX3vV8vMjH23Tb0C-6f3U-A_yIJup4NIym6-7L0jKC2FBWlg4GQeE",
  client_secret:
    "EKfkYaULVmmYDoNHlMEfUtWdsdsulWjm17TAgDRWK229-IwYhcfQa93Fo-ETRsQVtSswpUYdSuItUgshNFk4",
});

module.exports = paypal;
