// переменные из файла .env добавляются в process.env
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes/index');

const { PORT = 3000, MONGODB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

// запускаем серверное приложение
const app = express();

// подключаемся к БД
mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
});

// собираем в req.body поток запросов в формате JSON
app.use(bodyParser.json());

// подключаем маршруты запросов
app.use(router);

// взаимодействуем с клиентом через порт 3000
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
