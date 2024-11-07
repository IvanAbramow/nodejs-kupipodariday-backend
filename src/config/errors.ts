export const ERROR_MESSAGES = {
  /** Auth */
  INCORRECT_CREDENTIALS: 'Некорректная пара логин и пароль',
  CONFLICT_CREDENTIALS:
    'Пользователь с таким email или username уже существует',
  /** Offer */
  FORBID_OFFER_CREATE: 'Запрещено создавать сбор на собственный подарок',
  FORBID_OFFER: 'Сбор на подарок завершен',
  FORBID_OFFER_AMOUNT:
    'Запрещено жертвовать на подарок больше, чем сумма подарка',
  OFFER_NOT_FOUND: 'Сбор не найден',
  OFFER_ID_NOT_NUMBER: 'ID сбора должен быть числом',
  /** User */
  USER_NOT_FOUND: 'Пользователь не найден',
  WISH_NOT_FOUND: 'Подарок не найден',
  EMPTY_QUERY: 'Параметр query отсутствует',
  /** Wish */
  FORBID_TO_CHANGE_WISH: 'Вы не являетесь владельцем данного подарка',
  FORBID_TO_CHANGE_WISH_WITH_OFFER:
    'Нельзя изменять данные подарка, на который начали сбор',
  WISH_ID_NOT_NUMBER: 'ID подарка должен быть числом',
  /** Wishlist */
  WISHLIST_NOT_FOUND: 'Список подарков не найден',
  WISHLIST_ID_NOT_NUMBER: 'ID списка подарков должен быть числом',
  FORBID_TO_CHANGE_WISHLIST:
    'Вы не являетесь владельцем данного списка подарков',
  /** Server */
  SERVER_ERROR: 'Ошибка сервера',
};

export const ERROR_MESSAGE_WITH_CODE = new Map([
  [ERROR_MESSAGES.INCORRECT_CREDENTIALS, 401],
  [ERROR_MESSAGES.FORBID_OFFER_CREATE, 403],
  [ERROR_MESSAGES.FORBID_OFFER, 403],
  [ERROR_MESSAGES.FORBID_OFFER_AMOUNT, 403],
  [ERROR_MESSAGES.OFFER_NOT_FOUND, 404],
  [ERROR_MESSAGES.CONFLICT_CREDENTIALS, 409],
  [ERROR_MESSAGES.SERVER_ERROR, 500],
  [ERROR_MESSAGES.USER_NOT_FOUND, 404],
  [ERROR_MESSAGES.WISH_NOT_FOUND, 404],
  [ERROR_MESSAGES.FORBID_TO_CHANGE_WISH, 403],
  [ERROR_MESSAGES.FORBID_TO_CHANGE_WISH_WITH_OFFER, 403],
  [ERROR_MESSAGES.WISHLIST_NOT_FOUND, 404],
  [ERROR_MESSAGES.FORBID_TO_CHANGE_WISHLIST, 403],
]);
