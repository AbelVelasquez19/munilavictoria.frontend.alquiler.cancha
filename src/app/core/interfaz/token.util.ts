export function isTokenExpired(token: string): boolean {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // convertir a ms
    return Date.now() > exp;
  } catch (e) {
    return true;
  }
}