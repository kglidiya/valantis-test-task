import axios, { AxiosError, AxiosResponse } from "axios";
import axiosRetry from "axios-retry";
import { IStatusIds, IStatusProduct } from "./types";
export const BASE_URL = "https://api.valantis.store:41000/";

export const checkResponse = <T>(res: AxiosResponse): Promise<T> => {
  // console.log(res.status)
  if (res.status !== 200) {
    throw new Error();
  } else {
    return res.data;
  }
};

export const getData = (
  body: { [name: string]: string | number },
  password: string
) => {
  axiosRetry(axios, {
    retries: 1,
    retryCondition: () => true,
  });
  const result = axios
    .post(
      BASE_URL,
      {
        ...body,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Auth": password,
        },
      }
    )
    .then((res) => {
      if (res.status !== 200) {
        throw new Error();
      } else {
        return res.data;
      }
    })
    .catch((err) => {
      // console.log(err);
    });

  const data = result.then((res) => res);
  return data;
};

export const handleRequest = async (
  status: any,
  // setStatus: React.Dispatch<React.SetStateAction<IStatusIds|IStatusProduct>>,
  setStatus: any,
  password: string,
  data?: any
  // params: {} | null = null
) => {
  try {
    // console.log(data)
    setStatus({ ...status, isLoading: true });
    axiosRetry(axios, {
      retries: 2,
      retryCondition: () => true,
    });
    const res = await axios(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Auth": password,
      },
      data,
      // params,
    });

    if (res.status !== 200) {
      throw new Error();
    }

    setStatus({
      ...status,
      isLoading: false,
      data: [...status.data, ...res.data.result],
    });
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      setStatus({
        ...status,
        isLoading: false,
        error: error.response?.data.message,
      });
    }
  }
};

export const getDataTest = (body: any, password: string) => {
  const headers = { "Content-Type": "application/json", "X-Auth": password };

  fetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify({
      ...body,
    }),
    headers,
  })
    .then(async (response) => {
      const data = await response.json();
      // console.log(data);

      if (!response.ok) {
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
