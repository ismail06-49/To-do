import Storie from "@/public/storie.svg";
import Image from "next/image";

export default function Home() {
  return (
    <div className="secondColor flex flex-col justify-between items-center py-4 h-screen">
      <div className="flex flex-row justify-center items-center">
        <h1 className="text-4xl font-bold text-center">Welcome to Todos App</h1>
      </div>
      <div className="flex flex-col md:flex-row justify-evenly items-center w-full px-3 gap-3">
        <div className="flex flex-col justify-between items-center text-center">
          <h1 className="text-4xl md:text-7xl font-bold">TRACK YOUR TASKS</h1>
          <p className="text-lg md:text-xl font-bold">
            On our website, you can easily track your tasks and manage your time.
          </p>
        </div>
        <Image
          src={Storie}
          alt="Storie"
          className="w-[350px] md:w-[450px] h-[350px] md:h-[450px]"
        />
      </div>
      <p className="font-bold text-center">
        © <span className="text-black/50">Haddad Ismail </span>2025
      </p>
    </div>
  );
}
