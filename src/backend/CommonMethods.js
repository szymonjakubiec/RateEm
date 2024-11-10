/**
 *
 * @param {string} phone - The phone number to send verification code to.
 * @param {number} code - The verification code.
 */
const sendVerificationSMS = (phone, code) => {
  // SendDirectSms(mobileNumber, bodySMS)
  // .then((res) => console.log("SMS sent successfully", res))
  // .catch((err) => console.error("Error sending SMS", err));
};

module.exports = { sendVerificationSMS };
