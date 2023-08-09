// API ДЛЯ АУТЕНТИФИКАЦИИ ПОЛЬЗОВАТЕЛЕЙ И СОХРАНЕНИЯ ФИЛЬМОВ

// переменные из файла .env добавляются в process.env
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/error-handler');

const { PORT = 3000, MONGODB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

// запускаем серверное приложение
const app = express();

// подключаемся к БД
mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
});

// собираем в req.body поток запросов в формате JSON
app.use(bodyParser.json());

// записываем все поступающие запросы в отдельный файл ("журнал запросов")
app.use(requestLogger);

// подключаем маршруты запросов
app.use(router);

// записываем все возникающие ошибки в отдельный файл ("журнал ошибок")
app.use(errorLogger);

// подключаем обработчик ошибок (celebrate),
// возникших при валидации данных запроса (до запуска контроллера)
// все остальные ошибки передаются в централизованный обработчик ошибок
app.use(errors());

// обрабатываем ошибки централизованно
// выставляем сообщение об ошибке в зависимости от ее статутса
app.use(errorHandler);

// взаимодействуем с клиентом через порт 3000
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
