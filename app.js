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

// собираем поток запросов в формате json в req.body
app.use(bodyParser.json());

// собираем поток запросов в формате URL-кодированных данных в req.body
app.use(bodyParser.urlencoded({ extended: true }));

// подключаем маршруты запросов
app.use(router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
