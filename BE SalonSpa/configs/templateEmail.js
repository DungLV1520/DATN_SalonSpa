'use strict';
const path = require('path');
const fs = require('fs');

const templateForgot = fs.readFileSync(
  path.join(process.cwd(), 'templates', 'forgot-password.html'),
  'utf-8',
);

const resetEmail = (host, resetToken) => {
  const message = {
    subject: 'Reset Password',
    text:
      `${
        'You are receiving this because you have requested to reset your password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process: \n\n'
      }${host}/reset-password/${resetToken}\n\n` +
      `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    html: templateForgot.replace(
      '{{resetLink}}',
      `http://localhost:4200/auth/pass-create?token=${resetToken}`,
    ),
  };

  return message;
};

const confirmResetPasswordEmail = () => {
  const message = {
    subject: 'Password Changed',
    text:
      `You are receiving this email because you changed your password. \n\n` +
      `If you did not request this change, please contact us immediately.`,
  };

  return message;
};

const signupEmail = (name) => {
  const message = {
    subject: 'Account Registration',
    text: `Hi ${name}! Thank you for creating an account with us!.`,
  };

  return message;
};

const verificationCode = (code) => {
  const message = {
    subject: 'Verification Code',
    text:
      `Thank you for signing up for our service. To verify your email address, please enter the following code into the verification field on our website: \n` +
      `${code} \n` +
      `Your link is active for 30 minutes. After that, you will need to resend the verification email. \n` +
      `Thank you.
        `,
  };

  return message;
};

const contactEmail = () => {
  const message = {
    subject: 'Contact Us',
    text: `We received your message! Our team will contact you soon. \n\n`,
  };

  return message;
};

const orderConfirmationEmail = (booking) => {
  const message = {
    subject: `Booking Confirmation ${booking._id}`,
    text:
      `Hi ${booking.name}! Thank you for your booking!. \n\n` +
      `We've received your booking and will contact you as soon as posible. \n\n`,
  };

  return message;
};

const paymentSuccessEmail = (order) => {
  const message = {
    subject: `Payment successfully in ${order._id} by ${order.provider}`,
    text:
      `Hi ${order.user.firstName}! You have payment successfully!. \n\n` +
      `We've received your order and will contact you as soon as your package is shipped. \n\n`,
  };

  return message;
};

const createStaffAccount = (data) => {
  const message = {
    subject: 'Urgent: Change Your Password Immediately',
    text:
      `Dear ${data.fullname}, \n\n` +
      `We recently created an account for you on our platform. Please find your login credentials below: \n\n` +
      `Email: ${data.email} \n` +
      `Password: ${data.password} \n\n` +
      `To ensure the security of your account, we highly recommend changing your password as soon as possible. It is important to choose a strong, unique password that you have not used elsewhere. \n\n` +
      'Please follow these steps to change your password: \n\n' +
      '1. Visit our website \n' +
      '2. Log in using the provided email and password. \n' +
      '3. Navigate to the "Account Settings" or "Profile" section. \n' +
      '4. Locate the "Change Password" option and click on it. \n' +
      '5. Enter your current password and then provide a new, secure password. \n' +
      '6. Save the changes. \n\n' +
      'If you have any difficulties or questions regarding changing your password or any other account-related matter, please do not hesitate to contact our support team at salonspa@gmail.com. \n\n' +
      'We take the security of your account seriously, and your cooperation in changing your password promptly is greatly appreciated. Thank you for your attention to this matter. \n\n' +
      'Best regards, \n\n' +
      'Salon Spa',
  };
  return message;
};

const sendPaymentSuccessEmail = (data) => {
  const message = {
    subject: `Payment Confirmation - Order #${data.orderId}`,
    text:
      `Dear ${data.customerName}, \n\n` +
      `Thank you for your recent purchase at SalonSpa! We would like to confirm that we have received your payment for Order #${data.fullname}. \n\n` +
      `Your payment of ${data.amount} has been successfully processed and applied to your account. You can log in to your account on our website to view your order details and payment history. \n\n` +
      'If you have any questions or concerns regarding your order or payment, please do not hesitate to contact our customer support team. We are available to assist you from Monday to Friday, 9:00 am to 5:00 pm EST. \n\n' +
      'Thank you for choosing SalonSpa, and we look forward to serving you again in the future. \n\n' +
      'Best regards, \n\n' +
      'Salon Spa',
  };
  return message;
};

const sendPaymentFailedEmail = (data) => {
  const message = {
    subject: 'Payment Failed',
    text:
      `Dear ${data.customerName}, \n\n` +
      `We regret to inform you that your payment has failed. Unfortunately, we were unable to process your payment for the following bill: \n\n` +
      `Bill ID: ${data.billId} \n` +
      `Amount: ${data.amount} \n\n` +
      `Please check your payment method to ensure that it is up to date and has sufficient funds to cover the payment. Alternatively, you may choose to use a different payment method to complete your payment. \n\n` +
      `If you have any questions or concerns, please do not hesitate to contact our support team at salonspa@gmail.com. \n\n` +
      `We apologize for any inconvenience this may have caused and thank you for choosing Salon Spa for your beauty needs. \n\n` +
      `Best regards, \n\n` +
      `Salon Spa`,
  };
  return message;
};

const verificationUpdateProfile = (data) => {
  const message = {
    subject: `Verification Code for Your Account`,
    text:
      `Dear ${data.fullname},\n\n` +
      `Thank you for using our service. To verify your email address, please use the following verification code within the next hour:\n\n` +
      `Verification Code: ${data.code} \n\n` +
      `If you did not initiate this request, please ignore this email.\n\n` +
      `Thank you for choosing our service. \n\n` +
      `Best regards, \n\n` +
      `Salon Spa`,
  };

  return message;
};

module.exports = {
  resetEmail,
  confirmResetPasswordEmail,
  signupEmail,
  verificationCode,
  contactEmail,
  orderConfirmationEmail,
  paymentSuccessEmail,
  createStaffAccount,
  sendPaymentSuccessEmail,
  sendPaymentFailedEmail,
  verificationUpdateProfile,
};
