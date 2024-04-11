"use server";

import { ACCESS_TOKEN } from "@/services/httpClient";
import { LoginData } from "@/services/login";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function cookieAction(token: LoginData["access_token"]) {
  cookies().set("access_token", token);
  redirect("/dash-board");
}
