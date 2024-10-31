"use client";

import { Props } from "@/lib/category.types";
import { PlusCircleIcon, UploadCloud } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/services/api";
import { getCookieClient } from "@/lib/cookieClient";
import axios from "axios";

import { useToast } from "@/components/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

const Form = ({ categories }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [image, setImage] = useState<File | undefined>(undefined);
  const [previewImage, setPreviewImage] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  async function handleRegisterForm(formData: FormData) {
    const categoryId = formData.get("category") as string;
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const description = formData.get("description") as string;

    if (!name || !categoryId || !price || !description || !image) {
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append("name", name);
    data.append("price", price);
    data.append("description", description);
    data.append("category_id", categoryId);
    data.append("file", image);

    const token = getCookieClient();

    try {
      await api.post("/products", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (formRef.current) {
        formRef.current.reset();
      }
      setImage(undefined);
      setPreviewImage("");

      toast({
        title: "Sucesso!",
        description: "O produto foi cadastrado com sucesso.",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Erro ao cadastrar produto:", error.response?.data);
      } else {
        console.error("Erro inesperado:", error);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleImage(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];

      if (
        selectedImage?.type !== "image/png" &&
        selectedImage?.type !== "image/jpeg"
      ) {
        toast({
          title: "Formato não permitido!",
          description: "Apenas formatos png/jpef/jpg são válidos.",
          action: (
            <ToastAction altText="Try again">Tente novamente</ToastAction>
          ),
        });
        return;
      }

      setImage(selectedImage);
      setPreviewImage(URL.createObjectURL(selectedImage));
    }
  }

  function handleButtonClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  return (
    <div className="flex flex-col m-5 px-10">
      <div className="flex justify-center items-center flex-col gap-5">
        <div className="items-center inline-flex gap-2">
          <h1 className="text-4xl font-bold text-zinc-300">Novo Produto</h1>
          <button onClick={handleButtonClick}>
            <PlusCircleIcon className="text-blue-600 size-8 hover:scale-110 duration-300 hover:text-blue-800" />
          </button>
        </div>

        <form
          ref={formRef}
          className="flex flex-col m-2 w-[800px] gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleRegisterForm(formData);
          }}
        >
          <label className="relative w-full h-[280px] flex items-center justify-center border border-dashed border-zinc-300 rounded-lg">
            <Input
              className="text-white absolute hidden inset-0 opacity-0 cursor-pointer"
              name="file"
              type="file"
              accept="image/png, image/jpeg"
              ref={fileInputRef}
              required
              onChange={handleImage}
            />
            <div className="flex flex-col items-center justify-center text-center absolute">
              <UploadCloud className="size-10 z-50 text-blue-600 hover:scale-110 duration-300 hover:text-blue-800" />
              <p className="text-zinc-400 z-0">Clique para fazer upload</p>
            </div>
            {previewImage && (
              <Image
                alt="Imagem de preview"
                src={previewImage}
                fill={true}
                priority={true}
              />
            )}
          </label>

          <Select
            name="category"
            onValueChange={(value) => setCategoryId(value)}
            required
          >
            <SelectTrigger className="text-white">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 text-white">
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            className="text-white"
            type="text"
            name="name"
            placeholder="Nome do produto"
            required
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            className="text-white"
            type="text"
            name="price"
            placeholder="Valor"
            required
            onChange={(e) => setPrice(e.target.value)}
          />

          <textarea
            className="text-white w-full min-h-[90px] resize-none bg-zinc-950 border border-white rounded-md p-2 text-sm placeholder:text-zinc-500"
            name="description"
            placeholder="Descrição"
            required
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <Button
            className="text-white bg-blue-600 hover:bg-blue-900"
            disabled={
              !name.trim() ||
              !categoryId.trim() ||
              !price.trim() ||
              !description.trim() ||
              !image
            }
          >
            {loading ? "Carregando" : "Cadastrar"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Form;
