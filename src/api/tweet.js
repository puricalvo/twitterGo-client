import { API_HOST } from "../utils/constant";
import { getTokenApi } from "./auth";

export function addTweetApi(mensaje, imagen) {
  const url = `${API_HOST}/tweet`;
  const data = {
    mensaje,
    imagen: imagen || "",
  };

  const params = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
    body: JSON.stringify(data),
  };
  console.log(data);

  return fetch(url, params)
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return { code: response.status, message: "Tweet enviado" };
      }

      return response.json().then((errorData) => {
        console.error("Error al enviar el tweet:", errorData);
        return {
          code: response.status,
          message: errorData.message || "Error al enviar el tweet",
        };
      });
    })
    .catch((err) => {
      console.error("Network or parsing error:", err);
      return err;
    });
}

export function getUserTweetsApi(idUser, page) {
  const url = `${API_HOST}/leoTweets?id=${idUser}&pagina=${page}`;

  const params = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };

  return fetch(url, params)
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      return err;
    });
}

export function getTweetsFollowersApi(page = 1) {
  const url = `${API_HOST}/leoTweetsSeguidores?pagina=${page}`;

  const params = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };

  return fetch(url, params)
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      return err;
    });
}

export function deleteTweetApi(idTweet) {
  const url = `${API_HOST}/eliminarTweet?id=${idTweet}`;

  const params = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };

  return fetch(url, params)
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return { code: response.status, message: "Tweet eliminado" };
      }
      return { code: response.status, message: "No se pudo eliminar" };
    })
    .catch((err) => {
      return err;
    });
}

export function uploadImageTweetApi(file) {
  const url = `${API_HOST}/tweetImage`;
  const formData = new FormData();
  formData.append("nombre", file);

  const params = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getTokenApi()}`,
    },
    body: formData,
  };

  return fetch(url, params)
    .then((response) => {
      if (response.status === 200) {
        return response.text();
      }
      return null;
    })
    .then((result) => {
      return result;
    })
    .catch(() => {
      return null;
    });
}

export async function getImagenTweetApi(nombreImagen) {
  const url = `${API_HOST}/obtenerImageTweets?nombre=${nombreImagen}`;

  const params = {
    headers: {
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };

  try {
    const response = await fetch(url, params);
    if (response.status !== 200) return null;

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (err) {
    return null;
  }
}
