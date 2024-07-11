const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// Configure Paytm credentials
const PAYTM_MERCHANT_KEY = "your_merchant_key";
const PAYTM_MID = "your_merchant_id";
const PAYTM_WEBSITE = "WEBSTAGING";

// Define the payment route
app.post("/pay", async (req, res) => {
  const { orderId, amount, email, mobileNumber } = req.body;

  try {
    // Generate a unique transaction token
    const transactionToken = await generateTransactionToken(orderId, amount);

    // Create a payment request
    const paymentRequest = {
      orderId,
      transactionToken,
      amount,
      customerId: email,
      mobileNumber,
      email,
      website: PAYTM_WEBSITE,
      callbackUrl: "http://yourwebsite.com/callback", // Replace with your callback URL
    };

    // Make a request to initiate the payment
    const response = await axios.post(
      "https://securegw-stage.paytm.in/theia/api/v1/initiateTransaction?mid=" +
        PAYTM_MID +
        "&orderId=" +
        orderId,
      paymentRequest,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + transactionToken,
        },
      }
    );

    // Return the payment URL to the client
    res.json({ paymentUrl: response.data.body.txnToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to initiate payment" });
  }
});

// Generate the transaction token using Paytm API
async function generateTransactionToken(orderId, amount) {
  try {
    const response = await axios.post(
      "https://securegw-stage.paytm.in/theia/api/v1/token?mid=" +
        PAYTM_MID +
        "&orderId=" +
        orderId,
      {
        amount,
        customerId: "your_customer_id", // Replace with your customer ID
      }
    );

    return response.data.body.txnToken;
  } catch (error) {
    throw new Error("Failed to generate transaction token");
  }
}

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
