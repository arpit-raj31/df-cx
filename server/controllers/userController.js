const mysql = require('mysql2/promise');
const axios = require('axios'); 
const pool = require('../config/db.config');
const {insertUser} =require('../queries/queries')
const { login, getBaseHeaders, baseUrl } = require('../services/arkTraderService');



exports.registerUser = async (req, res) => {
  const {
    userName,
    firstName,
    email,
    mobile,
    password
  } = req.body;

  if (!userName || !firstName || !email || !mobile || !password) {
    return res.status(400).json({
      status: false,
      message: 'Missing required fields',
    });
  }

  try {

    const [rows] = await pool.execute(insertUser, [firstName, userName, email, mobile, password]);

    // Get admin token
    const adminToken = await login();
    const headers = getBaseHeaders(adminToken);
    
    // ArkTrader user payload
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
      country: "India",
      currenciesPolicyID: 1,
      firstName,
      forceChangePassword: false,
      genericPolicyID: 1,
      ignoreLiquidation: false,
      isAllowMultiSession: false,
      isDemo: true,
      isLocked: false,
      lastName,
      mobile,
      parentId: 25108,
      password,
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

    const arkRes = await axios.post(`${baseUrl}/api/apigateway/admin/public/api/v1/user`, userPayload, { headers });

    if (arkRes.data?.success) {
      return res.status(201).json({
        status: true,
        message: 'User registered successfully!'
      });
    } else {
      return res.status(400).json({
        status: false,
        message: arkRes.data?.message || 'Failed to register user in ArkTrader'
      });
    }

  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    return res.status(500).json({
      status: false,
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
