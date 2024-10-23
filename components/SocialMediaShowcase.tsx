import { useEffect, useState } from "react";

interface Box {
  opacity: number;
  bgColor: string;
  rotation: number;
  xOffset: number;
  yOffset: number;
}

export default function SocialShareSection() {
  const [boxes, setBoxes] = useState<Box[]>([]);

  useEffect(() => {
    const generateBoxes = () =>
      Array.from({ length: 8 }).map(() => ({
        opacity: Math.random() * 0.5 + 0.5,
        bgColor: getRandomColor(),
        rotation: Math.random() * 20 - 10,
        xOffset: Math.random() * 10 - 5,
        yOffset: Math.random() * 10 - 5,
      }));
    setBoxes(generateBoxes());
  }, []);

  function getRandomColor() {
    const colors = [
      "bg-red-400",
      "bg-green-400",
      "bg-blue-400",
      "bg-yellow-400",
      "bg-purple-400",
      "bg-pink-400",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  return (
    <div className="relative grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 mt-5 md:p-10">
      {boxes.map((box, index) => (
        <div
          key={index}
          className={`
            w-32 h-36 md:w-44 md:h-48 
            ${box.bgColor} 
            rounded-3xl 
            transition-all 
            duration-300
            ${index >= 4 ? 'hidden md:block' : ''}
          `}
          style={{
            opacity: box.opacity,
            transform: `rotate(${box.rotation}deg) translate(${box.xOffset}px, ${box.yOffset}px)`,
          }}
        />
      ))}
    </div>
  );
}