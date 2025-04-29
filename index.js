const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

const API_KEY = process.env.API_KEY;
const REDIRECT_URL = process.env.REDIRECT_URL;

app.get('/pay', async (req, res) => {
  try {
    const response = await axios.post('https://api.usegateway.net/v1/payments/', {
      name: 'Product',
      description: 'The best Product',
      pricing_type: 'fixed_price',
      local_price: {
        amount: 10,
        currency: 'USD'
      },
      metadata: {
        user_id: 123
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
    return res.redirect(paymentUrl);
  } catch (error) {
    console.error('Ошибка при создании оплаты:', error.response?.data || error.message);
    return res.status(500).send('Ошибка создания платежа.');
  }
});

// Обработка всех других маршрутов
app.get('*', (req, res) => {
  res.status(404).send('Страница не найдена. Перейдите по ссылке /pay для оплаты.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
