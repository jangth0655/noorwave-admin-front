import { AxiosError } from "axios";
import { api } from "./httpClient";
import HttpError from "./httpError";

export type LoginArgs = {
  login_id: string;
  password: string;
};

export type LoginData = { access_token: string; token_type: string };

export const login = async ({ login_id, password }: LoginArgs) => {
  try {
    const response = await (
      await api.post<Promise<LoginData>>("/login", {
        login_id,
        password,
      })
    ).data;
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      const { response } = error;
      throw new HttpError(response?.status, error?.toString()).errorData;
    }
    throw new Error("통신에러");
  }
};
