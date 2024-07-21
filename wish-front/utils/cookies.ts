import Cookies from "js-cookie";

export const setCookie = <T>(
  name: string,
  value: T,
  expires?: number
): void => {
  const options = expires ? { expires } : undefined;
  Cookies.set(name, JSON.stringify(value), options);
};

export const getCookie = <T>(name: string): T | undefined => {
  const cookieValue = Cookies.get(name);
  return cookieValue ? JSON.parse(cookieValue) : undefined;
};

export const removeCookie = (name: string): void => {
  Cookies.remove(name);
};
