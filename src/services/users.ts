import { api } from "./httpClient";

export const getUsers = async () => {
  const response = await (await api.get<Promise<User>>("/user")).data;
  return response;
};

export type CreateUserArgs = Pick<
  UserInfo,
  "email" | "name" | "phone" | "purchases"
>;

export const createUser = async (args: CreateUserArgs) => {
  const { email, name, phone, purchases } = args;
  const response = await (
    await api.post<Promise<UserEditResult>>("/user", {
      name,
      email,
      phone,
      purchases,
    })
  ).data;
  return response;
};

export const deleteUser = async (...id: number[]) => {
  const response = await (
    await api.delete<Promise<UserEditResult>>("/user", {
      data: {
        id,
      },
    })
  ).data;
  return response;
};

export type UserEditResult = {
  message: string;
};

export type User = {
  items: UserInfo[];
  pagination_pages: number;
  total_count: number;
  total_count_filtered: number;
};

export type UserInfo = {
  name: string;
  email: string;
  phone: string;
  id: number;
  mod_dt: Date;
  reg_dt: Date;
  total_quantity: string;
  purchases: UserPurchase[];
};

export type UserPurchase = {
  id?: number;
  purchase_date?: string;
  purchase_order?: number;
  quantity?: number;
};
