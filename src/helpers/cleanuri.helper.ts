import axios from "axios";

export const postShortenUrl = async (url: string) => {
  return axios
    .post("https://cleanuri.com/api/v1/shorten", {
      url,
    })
    .then((res) => res.data.result_url as string);
};
