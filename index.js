const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

const API_KEY = process.env.API_KEY;
const REDIRECT_URL = process.env.REDIRECT_URL;

app.get('/pay', async (req, res) => {
  try {
    const response = await axios.post('https://api.usegateway.net/v1/payments/', {
      name: 'Product',
      description: 'Автоматический заказ',
      pricing_type: 'fixed_price',
      local_price: {
        amount: 10,
        currency: 'USD'
      },
      redirect_url: REDIRECT_URL,
      cancel_url: REDIRECT_URL
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-key': API_KEY
      }
    });

    const paymentUrl = response.data.payment_url;
    res.redirect(paymentUrl);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Ошибка при создании оплаты');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));