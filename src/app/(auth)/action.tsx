"use server";

import { LoginData } from "@/services/login";
import { cookies } from "next/headers";

export async function cookieAction(token: LoginData["access_token"]) {
  cookies().set("access_token", token);
  // // or
  // cookies().set('name', 'lee', { secure: true })
  // // or
  // cookies().set({
  //   name: 'name',
  //   value: 'lee',
  //   httpOnly: true,
  //   path: '/',
  // })
}
