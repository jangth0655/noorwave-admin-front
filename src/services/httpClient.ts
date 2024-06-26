import axios, { AxiosError, AxiosResponse } from 'axios';
import HttpError from './httpError';
import { cookie } from '@/utils/cookieManage';

export type ServerError = { statusCode: number; errorMessage: string };

export const api = axios.create({
  baseURL: '/api/v1',
});

api.interceptors.request.use(
  async (config) => {
    const token = cookie();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    if (error instanceof AxiosError) {
      const { response } = error;
      const httpError = new HttpError(response?.status, response?.statusText).errorData;
      throw httpError;
    }
    throw new Error('네트워크 통신 에러 발생');
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    const contentType = response.headers['content-type'];
    if (contentType && contentType.includes('text/html')) {
      throw new HttpError(401, '로그인이 필요합니다.');
    }
    return response;
  },
  async (error) => {
    if (error instanceof AxiosError) {
      if (error.response) {
        throw new HttpError(error.response.status, error.toString());
      } else {
        throw new Error('서버에 연결할 수 없거나, 응답이 없습니다.');
      }
    }
    console.error('알 수 없는 에러 발생:', error);
    throw new Error('알 수 없는 통신 에러가 발생했습니다.');
  }
);
