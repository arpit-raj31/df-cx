const twilioService = require('../services/tiwilioService')

// This would normally come from a database or cache
let verificationCodes = {};  // Simple in-memory store for demonstration

/**
 * Controller function to send the verification code to a phone number.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const sendVerificationCode = (req, res) => {
    const { phoneNumber } = req.body;

    // Basic phone number validation (you can expand it based on your needs)
    if (!phoneNumber) {
        return res.status(400).json({ message: 'Phone number is required' });
    }

    const verificationCode = twilioService.sendVerificationCode(phoneNumber);

    // Save the verification code in the in-memory store (use DB in real app)
    verificationCodes[phoneNumber] = verificationCode;

    res.status(200).json({ message: 'Verification code sent successfully' });
};

/**
 * Controller function to verify the code entered by the user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const verifyCode = (req, res) => {
    const { phoneNumber, enteredCode } = req.body;

    // Check if the phone number and code are present
    if (!phoneNumber || !enteredCode) {
        return res.status(400).json({ message: 'Phone number and code are required' });
    }

    // Fetch the stored code (in a real app, you'd query the database)
    const storedCode = verificationCodes[phoneNumber];

    if (!storedCode) {
        return res.status(400).json({ message: 'No verification code found for this phone number' });
    }

    // Check if the entered code matches the stored code
    if (parseInt(enteredCode, 10) === storedCode) {
        res.status(200).json({ message: 'Phone number verified successfully' });
    } else {
        res.status(400).json({ message: 'Invalid verification code' });
    }
};

module.exports = { sendVerificationCode, verifyCode };
