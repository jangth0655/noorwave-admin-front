import { api } from './httpClient';

export type LoginArgs = {
  login_id: string;
  password: string;
};

export type LoginData = { access_token: string; token_type: string };

export const login = async ({ login_id, password }: LoginArgs) => {
  const response = await (
    await api.post<Promise<LoginData>>('/login', {
      login_id,
      password,
    })
  ).data;

  return response;
};
