require('dotenv').config();
const axios = require('axios');

// Environment variables with fallbacks
const baseUrl = process.env.BASE_URL || "https://ark2api.theplatformapi.com";
const userName = process.env.USERNAME || "Tradecfdin-admin";
const password = process.env.PASSWORD || "1234";
const companyName = process.env.COMPANY_NAME || "Trade CFD"; // companyName should be non-empty
const deviceType = process.env.DEVICE_TYPE || "API";

// Token cache
let token = null;
let tokenExpiry = null; // For future use (e.g., refresh token based on expiry)

/**
 * Logs in as the admin and retrieves a token.
 */
async function login() {
    try {
        if (token) {
            return token; // reuse cached token
        }

        // console.log('Admin login...');

        const response = await axios.post(`${baseUrl}/api/apigateway/login/public/api/v1/login`, {
            companyName: "Trade CFD",       // Use exact string from working Postman payload
            userName: "Tradecfdin-admin",   // Case-sensitive
            password: "1234"
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data?.data?.token) {
            token = response.data.data.token;
            // console.log('Admin logged in.');
            return token;
        } else {
            throw new Error('Invalid login response or missing token.');
        }
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        throw error;
    }
}


/**
 * Returns base headers including authorization and company details.
 */
function getBaseHeaders(adminToken) {
    return {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
        'companyName': companyName,
        'deviceType': deviceType
    };
}

module.exports = { login, getBaseHeaders, baseUrl };
