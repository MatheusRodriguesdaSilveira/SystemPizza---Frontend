"use client";

import { useState } from "react";
import { api } from "@/services/api";
import Button from "@/components/button/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Lock, UserPlus } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface SignupPageProps {}

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(formData: FormData) {
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    if (!name || !email || !password) {
      setError("PREENCHA TODOS OS CAMPOS");
      return;
    }

    try {
      await api.post("/users", { name, email, password });

      // Após o sucesso, adicione um evento personalizado para mudar a aba
      const signupEvent = new CustomEvent("signupSuccess");
      window.dispatchEvent(signupEvent);
    } catch (err: any) {
      if (err.response && err.response.data.error === "Email já existente") {
        setError("Email já está cadastrado.");
      } else {
        setError("Erro ao cadastrar. Tente novamente.");
      }
    }
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        handleRegister(formData);
      }}
      className="flex-col flex gap-6 w-[400px] max-w-md bg-transparent border border-zinc-800 rounded-xl shadow-md p-8 items-center justify-center"
    >
      {error && <p className="text-red-500">{error}</p>}
      <CardHeader>
        <CardTitle className="text-white text-2xl flex items-stretch">
          <UserPlus className="text-blue-500 size-7 mr-2" />
          Account
        </CardTitle>
        <CardDescription>
          Make changes to your account here. Click save when you're done.
        </CardDescription>
      </CardHeader>
      <div className="relative">
        <User className="absolute left-2 top-1/2 transform -translate-y-1/2 text-zinc-100 size-5" />
        <Input
          className="px-10 text-white"
          type="text"
          placeholder="Digite o seu nome..."
          name="name"
        />
      </div>
      <div className="relative">
        <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-zinc-100 size-5" />
        <Input
          className="px-10 text-white"
          type="email"
          placeholder="Digite seu email..."
          name="email"
        />
      </div>
      <div className="relative">
        <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-zinc-100 size-5" />
        <Input
          className="px-10 text-white"
          type="password"
          placeholder="Digite sua senha..."
          name="password"
        />
      </div>
      <Button />
    </form>
  );
}
