// utils/auth.js
import jwtDecode from "jwt-decode";

export function isTokenValid(token) {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    console.log("decoded.exp:", decoded.exp);

    return decoded.exp && decoded.exp > currentTime;
  } catch (err) {
    return false;
  }
}
