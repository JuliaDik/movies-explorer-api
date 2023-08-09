const { statusCodes } = require('../utils/constants');

// некорректный запрос от клиента к серверу
class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCodes.conflictError;
  }
}

module.exports = ConflictError;
