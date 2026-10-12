export const API_HOST = (
  process.env.REACT_APP_API_HOST || "http://localhost:8080"
).replace(/\/$/, "");
export const IMAGE_URL = `${API_HOST}/images/`;
export const TOKEN = "token";
