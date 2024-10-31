const Button = () => {
  return (
    <button
      type="submit"
      className="group/button relative overflow-hidden rounded-lg bg-blue-600 w-[255px] py-2.5 text-sm text-white font-bold transition-all duration-500 hover:border-blue-500 active:scale-95 hover:scale-105"
    >
      <span className="absolute bottom-0 left-0 z-0 h-0 w-full bg-gradient-to-t from-blue-800 to-blue-600 transition-all duration-500 group-hover/button:h-full" />
      <span className="relative z-10 transition-all duration-500">Acessar</span>
    </button>
  );
};

export default Button;
