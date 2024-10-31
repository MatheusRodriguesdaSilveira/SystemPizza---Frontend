"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignupPage from "@/app/cadastro/page";
import LoginForm from "@/app/login/LoginForm";

export default function TabsDemo() {
  const [activeTab, setActiveTab] = useState("login");

  useEffect(() => {
    // Ouve o evento customizado `signupSuccess`
    function handleSignupSuccess() {
      setActiveTab("login");
    }

    window.addEventListener("signupSuccess", handleSignupSuccess);

    // Limpeza ao desmontar o componente
    return () => {
      window.removeEventListener("signupSuccess", handleSignupSuccess);
    };
  }, []);

  return (
    <div className="justify-center items-center flex flex-col">
      <div className="m-16 flex justify-center text-center">
        <h1 className="text-6xl font-semibold text-zinc-300">System</h1>
        <h1 className="text-6xl font-semibold -mx-[16.5px] text-blue-500">
          Pizza🍕
        </h1>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-[400px]"
      >
        <TabsList className="grid w-full grid-cols-2 justify-center items-center">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="signup">
          <SignupPage /> {/* Sem `onSignupSuccess` */}
        </TabsContent>

        <TabsContent value="login">
          <LoginForm />
          <div className="justify-center items-center flex flex-col m-5">
            <button
              type="button"
              onClick={() => setActiveTab("signup")}
              className="text-zinc-200 hover:scale-95 duration-300 hover:text-blue-500"
            >
              Não possui uma conta? Crie uma agora!
            </button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
