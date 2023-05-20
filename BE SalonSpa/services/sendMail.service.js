const sgMail = require('../configs/mail');
const configs = require('../configs/configuration');
const template = require('../configs/templateEmail');

exports.sendEmail = async (email, type, data, host = '') => {
  try {
    const message = prepareTemplate(type, host, data);
    const config = {
      from: {
        name: 'Salon Spa',
        email: configs.MAIL,
      },
      to: email,
      subject: message.subject,
      text: message.text,
      html: message.html,
    };
    return await sgMail.send(config);
  } catch (error) {
    throw new Error(error);
  }
};

const prepareTemplate = (type, host, data) => {
  let message;

  switch (type) {
    case 'reset':
      message = template.resetEmail(host, data);
      break;

    case 'reset-confirmation':
      message = template.confirmResetPasswordEmail();
      break;

    case 'verification-code':
      message = template.verificationCode(data);
      break;

    case 'signup':
      message = template.signupEmail(data);
      break;

    case 'contact':
      message = template.contactEmail();
      break;

    case 'booking-confirmation':
      message = template.orderConfirmationEmail(data);
      break;

    case 'payment-success':
      message = template.paymentSuccessEmail(data);
      break;

    case 'create-staff-account':
      message = template.createStaffAccount(data);
      break;

    case 'send-payment-success-email':
      message = template.sendPaymentSuccessEmail(data);
      break;

    case 'send-payment-failed-email':
      message = template.sendPaymentFailedEmail(data);
      break;

    case 'verification-update-profile':
      message = template.verificationUpdateProfile(data);
      break;
    default:
      message = '';
  }

  return message;
};
