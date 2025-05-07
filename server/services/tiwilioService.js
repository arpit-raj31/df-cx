const twilio = require('twilio');

// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

// Your Twilio phone number
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

/**
 * Send a verification code via SMS.
 * @param {string} phoneNumber - The phone number to send the code to.
 * @returns {number} - The generated verification code.
 */
function sendVerificationCode(phoneNumber) {
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    // Send the SMS
    client.messages.create({
        body: `Your verification code is ${verificationCode}`,
        from: twilioNumber,
        to: phoneNumber,
    })
    .then(message => console.log('Message sent:', message.sid))
    .catch(err => console.error('Error sending message:', err));

    return verificationCode; // You should save this in a database for verification
}

module.exports = { sendVerificationCode };
