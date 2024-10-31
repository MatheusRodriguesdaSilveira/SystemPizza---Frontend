"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { getCookie } from "cookies-next";
import { RefreshCw } from "lucide-react";
import { Modal } from "./components/modal";
import { Header } from "./components/header";

interface UserData {
  name: string;
  email: string;
}

const Dashboard = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getCookie("login");

        if (!token) {
          throw new Error("Token não encontrado");
        }

        const response = await api.get("/info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário", error);
        router.push("/");
      }
    };

    fetchUserData();
  }, [router]);

  const handleRefresh = () => {
    window.location.reload(); // Recarrega a página atual
  };

  if (!userData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-zinc-400 m-2">Carregando</h1>
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col m-5 px-10">
        <div className="flex flex-col text-white text-base">
          <h1 className="underline underline-offset-4 decoration-blue-600">
            Bem-vindo ao Dashboard
          </h1>
          <p>
            Nome:
            <span className="decoration-blue-600 underline underline-offset-4">
              {userData.name}
            </span>
          </p>
          <p>
            Email:
            <span className="decoration-blue-600 underline underline-offset-4">
              {userData.email}
            </span>
          </p>
        </div>

        <Header />

        <div className="flex justify-between m-10 px-20 flex-col gap-5">
          <div className="items-center inline-flex gap-2">
            <h1 className="text-5xl font-bold text-zinc-300">Pedidos</h1>
            <button onClick={handleRefresh} className="flex items-center">
              <RefreshCw className="text-blue-600 size-9" />
            </button>
          </div>

          <section className="flex flex-col gap-4">
            <Modal />
          </section>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
