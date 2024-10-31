import { LogOut } from "lucide-react";
import Link from "next/link";

export const Header = () => {
  return (
    <>
      <header className="flex justify-between items-center m-12 rounded-full">
        <div className="flex justify-center items-center">
          <h1 className="text-5xl font-semibold text-zinc-300">System</h1>
          <h1 className="text-5xl font-semibold -mx-[12px] text-blue-500">
            Pizza🍕
          </h1>
        </div>

        <nav className="m-5">
          <ul className="flex gap-6 text-center items-center rounded-full text-zinc-300 text-lg">
            <Link
              className="hover:text-blue-600 duration-300"
              href="/dashboard"
            >
              Pedidos
            </Link>
            <Link
              className="hover:text-blue-600 duration-300"
              href="/dashboard/category"
            >
              Categoria
            </Link>
            <Link
              className="hover:text-blue-600 duration-300"
              href="/dashboard/product"
            >
              Produtos
            </Link>
            <Link className="hover:text-blue-600 duration-300" href="/">
              <LogOut />
            </Link>
          </ul>
        </nav>
      </header>
    </>
  );
};
