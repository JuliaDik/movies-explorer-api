const { statusCodes, ServerErrorMessage } = require('../utils/constants');

const errorHandler = (err, req, res, next) => {
  // по умолчанию: статус ошибки 500 "Внутренняя ошибка сервера" (запрос не удалось выполнить)
  const { statusCode = statusCodes.serverError, message } = err;

  res
    .status(statusCode)
    // статус ошибки --> появляется соответствующее сообщение об ошибке
    .send({
      message:
        statusCode === statusCodes.serverError
          ? ServerErrorMessage.server
          : message,
    });
  next();
};

module.exports = errorHandler;
