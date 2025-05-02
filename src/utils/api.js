import axios from "axios";
import { AUTH_TOKEN } from "@/src/utils/keys";

const BASE_URL =
  "https://n24tjyszxraupd5cuogxf377i40xiltl.lambda-url.ap-south-1.on.aws";

export const get = (path, queryParams) => {
  console.log("GET",BASE_URL + path, queryParams);
  const response = axios.get(BASE_URL + path, {
    params: { ...queryParams },
    headers: {
      "auth-token": AUTH_TOKEN,
    },
  });
  return response;
};

export const post = (path, queryParams, payload) => {
  console.log("POST",BASE_URL + path, payload, queryParams);
  const response = axios.post(BASE_URL + path, payload, {
    params: { ...queryParams },
    headers: {
      "auth-token": AUTH_TOKEN,
    },
  });
  return response;
};


export const put = (path, queryParams, payload) => {
  console.log("PUT",BASE_URL + path, payload, queryParams);
  const response = axios.put(BASE_URL + path, payload, {
    params: { ...queryParams },
    headers: {
      "auth-token": AUTH_TOKEN,
    },
  });
  return response;
};
