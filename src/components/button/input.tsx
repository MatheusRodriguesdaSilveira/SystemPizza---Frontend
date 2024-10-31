import { FC } from "react";

// Definindo a interface para as props do componente
interface InputProps {
  type?: string;
  placeholder?: string;
  name: string; // O 'name' é obrigatório e será do tipo string
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean; // Adicione a propriedade required como opcional
}

const Input: FC<InputProps> = ({
  type = "text",
  placeholder = "Digite algo...",
  name,
  value,
  onChange,
  required = false, // Define como false por padrão
}) => {
  return (
    <input
      type={type}
      name={name} // Tipado como string
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required} // Use a prop required aqui
      className="placeholder:italic placeholder:text-slate-300 text-white block bg-blue-500/5 w-full border border-slate-500 rounded-md py-1.5 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm font-medium"
    />
  );
};

export default Input;
