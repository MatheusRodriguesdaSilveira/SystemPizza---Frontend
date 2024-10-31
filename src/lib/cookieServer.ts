import { cookies } from "next/headers";

export function getCookieServer() {
    const token = cookies().get("login")?.value;
    return token || null;
}
