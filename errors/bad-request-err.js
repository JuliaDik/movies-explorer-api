const { statusCodes } = require('../utils/constants');

// некорректный запрос от клиента к серверу
class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCodes.badRequestError;
  }
}

module.exports = BadRequestError;
