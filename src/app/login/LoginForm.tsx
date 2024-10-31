"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { Mail, Lock, CircleUser } from "lucide-react";
import { api } from "@/services/api";
import { Input } from "@/components/ui/input";
import Button from "@/components/button/button";

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (loginSuccess) {
      router.push("/dashboard");
    }
  }, [loginSuccess, router]);

  if (!mounted) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !password) {
      setError("Email ou senha estão vazios.");
      return;
    }

    try {
      const response = await api.post("/login", { email, password });

      if (!response.data.auth.token) {
        setError("Token não recebido.");
        return;
      }

      const expressTime = 60 * 60 * 24 * 30; // 30 dias em segundos
      setCookie("login", response.data.auth.token, {
        maxAge: expressTime,
        path: "/",
      });

      setLoginSuccess(true);
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      setError("Erro ao fazer login.");
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex-col flex gap-6 w-[400px] max-w-md bg-transparent border border-zinc-800 rounded-lg shadow-md p-8 items-center justify-center"
    >
      {error && <p className="text-red-500">{error}</p>}
      <CardHeader>
        <CardTitle className="text-white text-2xl items-center flex">
          <CircleUser className="text-blue-500 size-7 mr-2 relative" />
          Login
        </CardTitle>
        <CardDescription>
          Make changes to your account here. Click save when you're done.
        </CardDescription>
      </CardHeader>

      <div className="relative">
        <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-zinc-100 size-5" />
        <Input
          className="px-10 text-white"
          type="email"
          placeholder="Digite seu email..."
          name="email"
          value={email}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="relative">
        <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-zinc-100 size-5" />
        <Input
          className="px-10 text-white"
          type="password"
          placeholder="Digite sua senha..."
          name="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          required
        />
      </div>

      <Button />
    </form>
  );
};

export default LoginForm;
