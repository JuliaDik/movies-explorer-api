const { statusCodes } = require('../utils/constants');

// запрещен доступ к ресурсу
class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCodes.forbiddenError;
  }
}

module.exports = ForbiddenError;
