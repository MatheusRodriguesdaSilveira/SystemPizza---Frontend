import Form from "./components/form";
import { api } from "@/services/api";
import { getCookieServer } from "@/lib/cookieServer";
import { Header } from "../components/header";

export default async function Product() {
  const token = getCookieServer();

  const response = await api.get("/category", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return (
    <main className="flex flex-col m-5 px-10">
      <Header />
      <Form categories={response.data} />
    </main>
  );
}
