import React from "react";
import Input from "./Input";
import Button from "./Button";
import Image from "next/image";
import OldMan from "../assets/oldMan.png";
import { useRouter } from "next/navigation";
// const models = ["Flux Dev", "Flux Schnell", "Flux Pro"];

const HeroCard: React.FC = () => {
  const router = useRouter();
  const handleGenerate = () => {
    router.push("/login");
  };

  return (
    <div className="p-3 bg-black flex flex-col rounded-lg w-full max-w-2xl h-[26rem] sm:h-[28rem] justify-center items-center">
      <div className="bg-white flex-grow mb-2 w-full rounded-lg flex items-center justify-center overflow-hidden">
        <Image
          src={OldMan}
          alt="old man"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className="bg-white rounded-lg h-14 w-full flex items-center px-2">
        <div className="text-black flex flex-grow ml-2">
          <Input />
        </div>
        <div className="text-black ml-2">
          <Button onClick={handleGenerate}>Generate</Button>
        </div>
        {/* <ModelDropdown models={models} onSelect={handleModelSelect} /> */}
      </div>
    </div>
  );
};

export default HeroCard;
