"use server";

import { cookies } from "next/headers";

export type Theme = "light" | "dark";

const THEME_COOKIE_NAME = "theme";
const THEME_COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year

export async function getTheme(): Promise<Theme> {
  const cookieStore = await cookies();
  const theme = cookieStore.get(THEME_COOKIE_NAME);
  return (theme?.value as Theme) || "light";
}

export async function setTheme(theme: Theme): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(THEME_COOKIE_NAME, theme, {
    maxAge: THEME_COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
  });
}
