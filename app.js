const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000, DATA_BASE = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

// запускаем серверное приложение
const app = express();

// подключаемся к БД
mongoose.connect(DATA_BASE, {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
