// API ДЛЯ РЕГИСТРАЦИИ/АВТОРИЗАЦИИ ПОЛЬЗОВАТЕЛЕЙ И СОХРАНЕНИЯ ФИЛЬМОВ
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const limiter = require('./middlewares/rateLimit');
const router = require('./routes/index');
const { PORT, DB } = require('./utils/config');

// запускаем серверное приложение
const app = express();

// подключаемся к БД
mongoose.connect(DB, {
  useNewUrlParser: true,
});

// настраиваем кросс-доменные запросы
app.use(cors);

// обеспечить настройку заголовков HTTP, связанную с защитой от веб-уязвимостей
app.use(helmet());

// собираем в req.body поток запросов в формате JSON
app.use(bodyParser.json());

// записываем все поступающие запросы в отдельный файл ("журнал запросов")
app.use(requestLogger);

// ограничиваем количество запросов на сервер
app.use(limiter);

// подключаем маршруты запросов
app.use(router);

// записываем все возникающие ошибки в отдельный файл ("журнал ошибок")
app.use(errorLogger);

// подключаем celebrate: обработчик ошибок,
// возникших при валидации данных запроса (до запуска контроллера)
// все остальные ошибки передаются в централизованный обработчик ошибок
app.use(errors());

// централизованный обработчик ошибок
// выставляем сообщение об ошибке в зависимости от ее статуса
app.use(errorHandler);

// взаимодействуем с клиентом через порт 3000
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
