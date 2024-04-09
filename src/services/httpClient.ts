import axios, { AxiosError } from "axios";
import HttpError from "./httpError";

export type ServerError = { statusCode: number; errorMessage: string };

export const api = axios.create({
  baseURL: "/api/v1",
});

/* api.interceptors.request.use(
  async (config) => {
    const beforeAccessToken = getStorage(ACCESS_TOKEN);
    if (beforeAccessToken) {
      config.headers.Authorization = `Bearer ${beforeAccessToken}`;
    }
    return config;
  },
  (error) => {
    if (error instanceof AxiosError) {
      const { response } = error;
      const httpError = new HttpError(response?.status, response?.statusText)
        .errorData;
      throw httpError;
    }
    throw new Error("네트워크 통신 에러 발생");
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const beforeAccessToken = getStorage(ACCESS_TOKEN);

    if (!(error instanceof AxiosError))
      throw new Error("네트워크 통신 에러 발생");

    const originRequest = error.config as CustomAxiosRequestConfig;
    const httpError = new HttpError(
      error.response?.status,
      error.response?.statusText
    ).errorData;

    if (
      originRequest &&
      error.response &&
      beforeAccessToken &&
      !originRequest._retry &&
      error.response.status === 401
    ) {
      originRequest._retry = true;
      removeStorage(ACCESS_TOKEN);

      try {
        const { data: token } = await refreshTokenAPI(beforeAccessToken);
        if (!token) {
          throw new HttpError(401, "재 로그인이 필요합니다.");
        }
        setStorage({ name: ACCESS_TOKEN, value: token });
        originRequest._retry = false;
        const newHeaders = {
          ...originRequest.headers,
          Authorization: `Bearer ${token}`,
        };

        // 원래 요청을 새 엑세스 토큰으로 재시도
        return api({
          ...originRequest,
          headers: newHeaders,
        });
      } catch (error) {
        originRequest._retry = false;
        if (error instanceof AxiosError) {
          const { response } = error;
          const errorCode = response?.data;
          throw new HttpError(errorCode.errorCode, error.toString()).errorData;
        }
        throw new HttpError(401, "올바르지 않는 사용자입니다.");
      }
    }

    throw httpError;
  }
); */
