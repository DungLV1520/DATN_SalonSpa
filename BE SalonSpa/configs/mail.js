const sgMail = require('@sendgrid/mail');

const { SENDGRID_API_KEY } = require('./configuration');

sgMail.setApiKey(SENDGRID_API_KEY);

module.exports = sgMail;
