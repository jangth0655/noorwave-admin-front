"use server";

import { LoginData } from "@/services/login";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function cookieAction(token: LoginData["access_token"]) {
  cookies().set("access_token", token);
  redirect("/dash-board");
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
