import axios, { AxiosRequestConfig, Method } from 'axios';

const baseURL = process.env.REACT_APP_API_URL;

type AuthType = {
  accessToken: string;
  uid: string;
};

type RequestType = {
  url: string;
  method: Method;
  reqParams?: {
    params?: any;
    data?: any;
  };
};

export const authHeaders = ({
  accessToken,
  uid
}: AuthType): {
  'access-token': string;
  uid: string;
} => ({
  'access-token': accessToken,
  uid
});

const client = axios.create({
  baseURL
});

export default async function request(options: RequestType): Promise<any> {
  const { url, method, reqParams } = options;
  const reqConfig: AxiosRequestConfig = {
    url,
    method,
    headers: {
      'Access-Token': window.localStorage.getItem('accessToken')
    },
    ...reqParams
  };

  const response = await client(reqConfig);

  return response;
}
