export const GlobalComponent = {
  API_URL_LOCAL: 'http://localhost:3000/api/',
  // API_URL_LOCAL: 'https://salonspa.onrender.com/api/',
  SOCKET_ROOM_ID: 'SOCKET_ROOM_ID',
  SOCKET_ROOM_ID_NOTIFY: 'ROOM_ID_NOTIFY',
  // SOCKET_ENDPOINT: 'https://salonspa.onrender.com',
  SOCKET_ENDPOINT: 'http://localhost:3000',
  SOCKET_MESSAGE: 'MESSAGE',
  SOCKET_BOOKING: 'BOOKING',
  PAYMENT_SUCCESS: 'PAYMENT_SUCCESS',
  TOKEN_KEY: 'token',
  JWT_KEY: 'jwt',
  CUSTOMER_KEY: 'currentUser',
  ITEMS_PER_PAGE: 7,
  MAX_FILE_SIZE: 5,
  BRANCH_BOOKING: 'BRANCH_BOOKING',
  SERVICES_BOOKING: 'SERVICES_BOOKING',
  TIME_BOOKING: 'TIME_BOOKING',
  ID_BOOKING: 'ID_BOOKING',
};

export const FilterAll = {
  page: 1,
  size: 1000,
};
export interface Filter {
  page?: number;
  size?: number;
  search?: string;
  start?: string;
  end?: string;
  status?: String;
  bookingId?: String;
  event?: String;
}

export enum TypeNotify {
  PAYMENT = 'PAYMENT',
  BOOKING = 'BOOKING',
  USER = 'USER',
}
