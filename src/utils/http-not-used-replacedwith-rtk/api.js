import axiosInstance from './axios';

export const get = (path, queryParams) => {
  console.log("GET", path, queryParams);
  const response = axiosInstance.get(path, {
    params: { ...queryParams }
  });
  return response;
};

export const post = (path, queryParams, payload) => {
  console.log("POST",path, payload, queryParams);
  const response = axiosInstance.post(path, payload, {
    params: { ...queryParams }
  });
  return response;
};


export const put = (path, queryParams, payload) => {
  console.log("PUT", path, payload, queryParams);
  const response = axiosInstance.put(path, payload, {
    params: { ...queryParams }
  });
  return response;
};


export const del = (path, queryParams, payload) => {
  console.log("DELETE", path, payload, queryParams);
  const response = axiosInstance.delete(path, {
    params: { ...queryParams }
  });
  return response;
};

