import { useEffect, useState } from "react";
import img1 from "../assets/images/random/11.png";
import img2 from "../assets/images/random/12.png";
import img3 from "../assets/images/random/13.png";
import img4 from "../assets/images/random/14.png";
import img5 from "../assets/images/random/15.png";
import img6 from "../assets/images/random/16.png";
import img7 from "../assets/images/random/17.png";
import img8 from "../assets/images/random/18.png";
import img9 from "../assets/images/random/19.png";
import img10 from "../assets/images/random/20.png";
import img11 from "../assets/images/random/21.png";
import Image, { StaticImageData } from "next/image";

interface Box {
  opacity: number;
  bgColor: string;
  rotation: number;
  xOffset: number;
  yOffset: number;
  image: StaticImageData; // Add an image property to the Box type
}

export default function SocialShareSection() {
  const [boxes, setBoxes] = useState<Box[]>([]);

  useEffect(() => {
    const images = [
      img1,
      img2,
      img3,
      img4,
      img5,
      img6,
      img7,
      img8,
      img9,
      img10,
      img11,
    ];
    const generateBoxes = () =>
      Array.from({ length: 8 }).map(() => ({
        opacity: Math.random() * 0.5 + 0.5,
        bgColor: getRandomColor(),
        rotation: Math.random() * 20 - 10,
        xOffset: Math.random() * 10 - 5,
        yOffset: Math.random() * 10 - 5,
        image: images[Math.floor(Math.random() * images.length)], // Randomly assign an image
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
    <div className="relative grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-5 p-4 mt-5 md:p-10">
      {boxes.map((box, index) => (
        <div
          key={index}
          className={`
            w-32 h-36 md:w-44 md:h-48 
            ${box.bgColor} 
            rounded-3xl 
            transition-all 
            duration-300 
            overflow-hidden
            ${index >= 4 ? "hidden md:block" : ""}
          `}
          style={{
            opacity: box.opacity,
            transform: `rotate(${box.rotation}deg) translate(${box.xOffset}px, ${box.yOffset}px)`,
          }}
        >
          <Image
            src={box.image}
            alt={`Random Image ${index}`}
            layout="fill"
            objectFit="cover"
          />
        </div>
      ))}
    </div>
  );
}
