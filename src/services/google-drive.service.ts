import axios from "axios";

export const googleDriveRequestProps: { apiKey: string; token: string } = {
  apiKey: "",
  token: "",
};

const googleDriveAxiosInstance = axios.create({
  baseURL: "https://www.googleapis.com/drive/v3/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

googleDriveAxiosInstance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    if (!config.params?.public) {
      config.headers[
        "Authorization"
      ] = `Bearer ${googleDriveRequestProps.token}`;
    }

    config.params = {
      ...config.params,
      key: googleDriveRequestProps.apiKey,
    };

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default googleDriveAxiosInstance;
