import { api } from "./httpClient";

export const getUsers = async () => {
  const response = await (await api.get("/user")).data;
  console.log(response);
  return response;
};
