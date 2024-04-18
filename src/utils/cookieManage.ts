import { deleteCookie, getCookie } from 'cookies-next';

export const ACCESS_TOKEN = 'access_token';

export const cookie = () => {
  return getCookie(ACCESS_TOKEN);
};

export const removeCookie = () => {
  return deleteCookie(ACCESS_TOKEN);
};
