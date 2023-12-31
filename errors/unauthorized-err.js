const { statusCodes } = require('../utils/constants');

// неверная авторизация или аутентификация пользователя (отказ в доступе)
class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCodes.unauthorizedError;
  }
}

module.exports = UnauthorizedError;
