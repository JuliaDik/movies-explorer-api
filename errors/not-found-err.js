const { statusCodes } = require('../utils/constants');

// не найден запрашиваемый ресурс
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCodes.notFoundError;
  }
}

module.exports = NotFoundError;
