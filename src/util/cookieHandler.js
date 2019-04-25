export const setCookie = (cookieName, cookieValue, removeCookie) => {
  let expires;
  if (removeCookie) {
    expires='Thu, 01 Jan 1970 00:00:01 GMT';
  } else {
    const d = new Date();
    d.setTime(d.getTime() + (9999 * 24 * 60 * 60 * 1000));
    expires = `expires=${d.toUTCString()}`;
  }
  document.cookie = `${cookieName}=${cookieValue}; ${expires}; path=/`;
}

export const getCookie = (cookieName, cookies) => {
  const value = `; ${cookies}`;
  const parts = value.split(`; ${cookieName}=`);
  if (parts.length > 1) {
    return parts.pop().split(';').shift();
  }
  return null;
}

export const isValidCookie = (cookieName, cookies) => (
  getCookie(cookieName, cookies) !== null
);

export const deleteCookie = (cookieName) => {
  setCookie(cookieName, '', true);
};