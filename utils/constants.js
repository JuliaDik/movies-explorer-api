// ВАЛИДАЦИЯ URL (регулярное выражение)
const URL_REGEX = /https?:\/\/(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+#?/;

// СТАТУСЫ И СООБЩЕНИЯ ОБ ОШИБКАХ
const statusCodes = {
  badRequestError: 400,
  unauthorizedError: 401,
  forbiddenError: 403,
  notFoundError: 404,
  conflictError: 409,
  serverError: 500,
};

const BadRequestErrorMessage = {
  userData: 'Переданы некорректные данные при создании пользователя',
  userId: 'Передан некорректный _id пользователя',
  userUpdate: 'Переданы некорректные данные при обновлении профиля',
  movieData: 'Переданы некорректные данные при создании фильма',
  movieId: 'Передан некорректный _id фильма',
};

const UnauthorizedErrorMessage = {
  userLogin: 'Необходима авторизация',
  userCredentials: 'Неправильные почта или пароль',
};

const ForbiddenErrorMessage = {
  movieOwner: 'Нельзя удалить фильм другого пользователя',
};

const NotFoundErrorMessage = {
  userId: 'Пользователь с указанным _id не найден',
  movieId: 'Фильм с указанным _id не найден',
  noRoute: 'Запрашиваемый роут не найден',
};

const ConflictErrorMessage = {
  userEmail: 'Пользователь с таким email уже зарегистрирован',
};

const ServerErrorMessage = {
  server: 'На сервере произошла ошибка',
};

module.exports = {
  URL_REGEX,
  statusCodes,
  ConflictErrorMessage,
  BadRequestErrorMessage,
  NotFoundErrorMessage,
  ForbiddenErrorMessage,
  UnauthorizedErrorMessage,
  ServerErrorMessage,
};
