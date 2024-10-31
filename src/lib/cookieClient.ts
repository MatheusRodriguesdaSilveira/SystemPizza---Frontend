// lib/cookieClient.ts
import { getCookie } from "cookies-next";

export function getCookieClient() {
    const token = getCookie("login");
    return token || null;
}
