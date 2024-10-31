import { api } from "@/services/api";
import { getCookieServer } from "@/lib/cookieServer";
import { PlusCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "../components/header";
import { redirect } from "next/navigation";

const Category = () => {
  async function handleAddCategory(formData: FormData) {
    "use server";

    const token = getCookieServer();

    const name = formData.get("name");

    if (name === "") return;

    const data = {
      name: name,
    };

    await api
      .post("/category", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((err) => {
        console.log(err);
        return;
      });

    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col m-5 px-10">
      <Header />

      <div className="flex justify-center items-center flex-col gap-5">
        <div className="items-center inline-flex gap-2">
          <h1 className="text-4xl font-bold text-zinc-300">Nova Categoria</h1>
          <PlusCircleIcon className="text-blue-600 size-8" />
        </div>

        <form
          className="flex flex-col m-2 w-[800px] gap-5"
          action={handleAddCategory}
        >
          <Input
            className="text-white"
            type="text"
            name="name"
            placeholder="Digite o nome para categoria"
          />
          <Button className="text-white bg-blue-600 hover:bg-blue-900">
            Cadastrar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Category;
