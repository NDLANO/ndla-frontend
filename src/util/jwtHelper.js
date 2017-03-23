import decode from 'jwt-decode';

export function getTokenExpirationDate(token) {
  const decoded = decode(token);
  if (!decoded.exp) {
    return null;
  }
  const date = new Date(0);
  // const date = new Date(0); // The 0 here is the key, which sets the date to the epoch
  date.setUTCSeconds(decoded.exp);
  return date;
}

export function isTokenExpired(token) {
  const decoded = decode(token);
  const date = getTokenExpirationDate(token);
  if (date === null) {
    return false;
  }
  return !(decoded.exp < new Date().getTime());
}


export function getTimeToUpdate(token) {
  const now = Date.now();
  const expired = getTokenExpirationDate(token);
  const expireTime = expired.getTime() - now - (1000 * 60 * 5); // 1000 * 60 * 5 = 5 minutes;

  return expireTime > 0 ? expireTime : (1000 * 60 * 55);
}
