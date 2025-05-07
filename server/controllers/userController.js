const axios = require('axios');
const db = require('../config/db.config'); // Adjust path as needed
const { insertUser } = require('../queries/queries'); // Adjust path
const { login, getBaseHeaders, baseUrl } = require('../services/arkTraderService');

exports.registerUser = async (req, res) => {
    const {
        userName,
        firstName,
        lastName,
        email,
        mobile,
        password,
        
    } = req.body;

    try {

        await new Promise((resolve, reject) => {
            db.query(insertUser, [firstName, userName, email, mobile, password], (err, result) => {
              if (err) {
                console.error('DB insert error:', err);
                return reject(err);
              }
              resolve(result);
            });
          });
        const adminToken = await login(); // Get admin token
        const headers = getBaseHeaders(adminToken); // Get headers with token

        const userPayload = {
            accountID: -1,
            accountMirroringAccountIds: [],
            accountMirroringPolicyId: -1,
            address: "",
            currencySign: "",
            accountIdPrefix: "",
            clientPriceExecution: false,
            canTransferMoney: false,
            canTransferPosition: false,
            country:  "india",
            currenciesPolicyID: 1,
            firstName: firstName,
            forceChangePassword: false,
            genericPolicyID: 1,
            ignoreLiquidation: false,
            isAllowMultiSession: false,
            isDemo: true,
            isLocked: false,
            lastName: lastName || "",
            mobile: mobile,
            parentId: 25108,            // You can customize if needed
            password: password,
            secondPassword: "",
            investorPassword: "",
            percentageLevel1: 100.0,
            percentageLevel2: 100.0,
            percentageLevel3: 100.0,
            percentageLevel4: 100.0,
            creditLoanPercentage: 0.0,
            roboDealerPolicyId: -1,
            telephonePass: "",
            tradingType: 1,
            userCurrencyId: 1,
            userType: 1,
            username: userName,
            validateMoneyBeforeClose: false,
            validateMoneyBeforeEntry: true,
            closeOnly: false,
            openOnly: false,
            noSellAtLoss: false,
            enableCashDelivery: false,
            enableDepositRequest: false,
            canCreateOrUpdateEntryOrder: true,
            sendCredentialsEmailToUser: true,
            isVerified: true,
            ignoreBlockTradeIfInLoss: false,
            userWhiteListIps: [],
            enableApi: false,
            chargeMarginForEntry: false
        };

        const response = await axios.post(`${baseUrl}/api/apigateway/admin/public/api/v1/user`, userPayload, { headers });

      if (response.data && response.data.success) {
    return res.status(201).json({
        status: true,
        message: 'User registered successfully!'
    });
} else {
    return res.status(400).json({
        status: false,
        message: 'Failed to register user'
    });
}


    } catch (error) {
        console.error(' Error registering user:', error.response?.data || error.message);
        return res.status(500).json({
            message: 'Server error during user registration',
            error: error.response?.data || error.message
        });
    }
};




const apiUrl = process.env.BASE_URL; 

exports.login = async (req, res) => {
    const { userName, password } = req.body;
    const companyName = 'Trade CFD';  // Use exact value expected by the API

    const loginUrl = `${apiUrl}/api/apigateway/login/public/api/v1/login`;

    // console.log('Login URL:', loginUrl);
    // console.log('Payload:', { userName, password, companyName }); 
    try {
        const headers = {
            'Content-Type': 'application/json',
        };

        const response = await axios.post(
            loginUrl,
            { userName, password, companyName },
            { headers }
        );

        const data = response.data;
        // console.log(data);

        if (data?.success && data.data?.token) {
            return res.status(200).json({
                status: true,
                message: 'Login successful!',
                token: data.data.token,  // Send token directly
                user: {
                    id: data.data.id,
                    userName: data.data.userName,
                    firstName: data.data.firstName,
                    userTypeId: data.data.userTypeId,
                }
            });
        } else {
            return res.status(400).json({
                status: false,
                message: data.message || 'Login failed',
            });
        }

    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        return res.status(error.response?.status || 500).json({
            status: false,
            message: 'Server error during login',
            error: error.response?.data || error.message,
        });
    }
};
