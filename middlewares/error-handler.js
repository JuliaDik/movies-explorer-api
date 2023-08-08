const errorHandler = ((err, req, res, next) => {
  // по умолчанию: статус ошибки 500 (внутренняя ошибка сервера: запрос не удалось выполнить)
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    // статус ошибки - соответствующее сообщение
    .send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
});

module.exports = errorHandler;
