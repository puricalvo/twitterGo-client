import { API_HOST } from "../utils/constant";
import { getTokenApi } from "./auth";

export function checkFollowApi(idUser) {
  const url = `${API_HOST}/consultaRelacion?id=${idUser}`;
  const params = {
    headers: {
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };

  return fetch(url, params)
    .then((res) => res.json())
    .then((result) => {
      return result; // result ya es true o false
    })
    .catch(() => {
      return false; // Si hay error, asumimos que no lo sigue
    });
}

export function followUserApi(idUser) {
  const url = `${API_HOST}/altaRelacion?id=${idUser}`;
  const params = {
    method: "POST",
    headers: { Authorization: `Bearer ${getTokenApi()}` },
  };

  return fetch(url, params)
    .then((response) => {
      if (response.status === 201 || response.ok) return { status: true };
      return { status: false };
    })
    .catch(() => ({ status: false }));
}

export function unfollowUserApi(idUser) {
  const url = `${API_HOST}/bajaRelacion?id=${idUser}`;
  const params = {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getTokenApi()}` },
  };

  return fetch(url, params)
    .then((response) => {
      if (response.ok) return { status: true };
      return { status: false };
    })
    .catch(() => ({ status: false }));
}

export function getFollowsApi(paramsUrl) {
  const url = `${API_HOST}/listaUsuarios?${paramsUrl}`;

  const params = {
    headers: {
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };

  return fetch(url, params)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
}
