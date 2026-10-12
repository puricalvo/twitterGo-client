export const API_HOST =
  process.env.REACT_APP_API_HOST || "http://localhost:8080";
export const TOKEN = "token";
export const IMAGE_URL = `${API_HOST.replace(/\/$/, "")}/images/`;
